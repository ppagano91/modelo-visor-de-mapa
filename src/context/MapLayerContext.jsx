import { createContext, useState } from 'react';

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
    setInfo(information);
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
