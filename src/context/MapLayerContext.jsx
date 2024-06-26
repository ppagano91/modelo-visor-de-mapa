import { createContext, useState } from 'react';
import { capitalizeFirstLetter } from '../utils/functions';

export const MapLayerContext = createContext();

export const MapLayerProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);
  const [info, setInfo] = useState({});


  const addLayer = (layer) => {
    setLayers((prevLayers) => [...prevLayers, layer]);
  };

  const toggleLayer = (newLayer) => {
    setLayers((prevLayers) => {
      const layerExists = prevLayers.some(layer => layer.name === newLayer.name);
      if (layerExists) {
        return prevLayers.filter(layer => layer.name !== newLayer.name);
      } else {
        return [...prevLayers, newLayer];
      }
    });
  };

  const handleInfo = (information) => {
    const formattedInfo = Object.keys(information).reduce((acc, key) => {
      const parts = key.split('.');
      const newKey = parts.slice(0,1).join(' ');
  
      acc[newKey] = information[key];
      return acc;
    }, {});

    const newInfo = Object.keys(formattedInfo).reduce((acc, key) => {
      const gna = capitalizeFirstLetter(formattedInfo[key].gna.toLowerCase());
      const nam = formattedInfo[key].nam;
      acc[gna] = nam;
      return acc;
    }, {});

    setInfo(newInfo);
  }

  

  const removeLayer = (layerName) => {
    setLayers((prevLayers) => prevLayers.filter(layer => layer.name !== layerName));
  };

  return (
    <MapLayerContext.Provider value={{ layers, info, addLayer, removeLayer, toggleLayer, handleInfo }}>
      {children}
    </MapLayerContext.Provider>
  );
};
