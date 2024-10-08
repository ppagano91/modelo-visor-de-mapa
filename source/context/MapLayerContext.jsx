import { createContext, useState, useEffect } from 'react';
import { capitalizeFirstLetter } from '../utils/functions';
import { getEnv } from '../config';

export const MapLayerContext = createContext();

export const MapLayerProvider = ({ children }) => {
  const [hits, setHits] = useState([]);
  const [layers, setLayers] = useState([]);
  const [info, setInfo] = useState({});
  const [geoserverBaseUrl, setGeoserverBaseUrl] = useState('');
  const [activeLayers, setActiveLayers] = useState([]);
  const [marker, setMarker] = useState(null); // Nuevo estado para el marcador

  const baseMapLayer = {
    url: getEnv("VITE_MAPA_BASE"),
    layers: "mapa_base",
    name: "mapa_base",
    attribution: "&copy; attribution"
  };

  useEffect(() => {
    const geoserverUrl = getEnv("VITE_GEOSERVER_URL");
    const proxiedBaseLayerUrl = geoserverUrl
      ? `${geoserverUrl}${new URL(baseMapLayer.url).pathname}`
      : `/geoserver${new URL(baseMapLayer.url).pathname}`;

    setGeoserverBaseUrl(proxiedBaseLayerUrl);
  }, []);

  const addLayer = (layer) => {
    setLayers((prevLayers) => [...prevLayers, layer]);
  };

  const toggleLayer = layerProps => {
    setLayers(prevLayers => {
      const layerExists = prevLayers.some(
        layer => layer.name === layerProps.name
      );
      if (layerExists) {
        return prevLayers.filter(layer => layer.name !== layerProps.name);
      } else {
        return [...prevLayers, layerProps];
      }
    });
  };

  const clearAllSelections = () => {
    setActiveLayers([]);
    setLayers([]);
  };

  const handleInfoBaseMap = (data) => {
    const filteredInfo = {};
    let coordinates = data.coordenadas;
  
    delete data.coordenadas;
    const formattedInfo = Object.keys(data).reduce((acc, key) => {
      const parts = key.split('.');
      const newKey = parts.slice(0,1).join(' ');
  
      acc[newKey] = data[key];
      return acc;
    }, {});

    const newInfo = Object.keys(formattedInfo).reduce((acc, key) => {
      const gna = formattedInfo[key].gna ? capitalizeFirstLetter(formattedInfo[key].gna.toLowerCase()) : capitalizeFirstLetter(key.split("_").join(" "));
      let nam = formattedInfo[key].nam ? formattedInfo[key].nam : formattedInfo[key].fna;
      if("num_mapa" in formattedInfo[key] && formattedInfo[key].num_mapa !== null){
        nam = nam + " " + formattedInfo[key].num_mapa
      }
      acc[gna] = nam;
      return acc;
    }, {});
    setInfo({...newInfo, Longitud: coordinates.lng, Latitud: coordinates.lat});
  }

  const handleInfoWMSLayers = (data) => {
    let coordinates = data.coordenadas;
  
    delete data.coordenadas;
    const formattedInfo = Object.keys(data).reduce((acc, key) => {
        const parts = key.split('.');
        const newKey = parts.slice(0, 1).join(' ');

        const filteredProperties = Object.entries(data[key])
            .filter(([propKey, propValue]) => {
                return (
                    propValue !== null && 
                    propValue !== "" && 
                    !propKey.startsWith('fecha') && 
                    !propKey.startsWith('id') &&
                    !propKey.startsWith("geometry") &&
                    !propKey.startsWith("activo") &&
                    !propKey.startsWith("observaciones") &&
                    !propKey.startsWith("nombre_")
                );
            })
            .reduce((obj, [propKey, propValue]) => {
                obj[capitalizeFirstLetter(propKey)] = propValue;
                return obj;
            }, {});

        acc[newKey] = {
            ...filteredProperties,
        };
        
        return acc;
    }, {});

    const newInfo = Object.values(formattedInfo).reduce((acc, obj) => {
      return { ...acc, ...obj };
  }, {});
  setInfo({...newInfo, Longitud: coordinates.lng, Latitud: coordinates.lat});
};

  const resetInfo = () => {
    setInfo({});
    if (marker) {
      marker.remove();
      setMarker(null);
    }
  }

  const handleSetMarker = (value) => {
    setMarker(prevState => value)
  }

  const handleHits = (data) =>{
    setHits(prevState => {return prevState !== data ? data : prevState});
  }

  return (
    <MapLayerContext.Provider value={{ layers, hits, activeLayers, info, baseMapLayer, geoserverBaseUrl, addLayer, toggleLayer, handleInfoBaseMap, handleInfoWMSLayers, resetInfo, setActiveLayers, handleHits, setGeoserverBaseUrl, handleSetMarker, clearAllSelections }}>
      {children}
    </MapLayerContext.Provider>
  );
};
