import { createContext, useState, useEffect } from "react";
import { capitalizeFirstLetter } from "../utils/functions";
import { getEnv } from "../config";

export const MapLayerContext = createContext();

export const MapLayerProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);
  const [info, setInfo] = useState({});
  const [geoserverBaseUrl, setGeoserverBaseUrl] = useState("");
  const [activeLayers, setActiveLayers] = useState([]);

  const baseMapLayer = {
    url: getEnv("VITE_MAPA_BASE"),
    layers: "mapa_base",
    name: "mapa_base",
    attribution: "&copy; attribution",
  };

  useEffect(() => {
    const geoserverUrl = getEnv("VITE_GEOSERVER_URL");
    const proxiedBaseLayerUrl = geoserverUrl
      ? `${geoserverUrl}${new URL(baseMapLayer.url).pathname}`
      : `/geoserver${new URL(baseMapLayer.url).pathname}`;

    setGeoserverBaseUrl(proxiedBaseLayerUrl);
  }, []);

  useEffect(() => {
    const activeLayerNames = layers.map(layer => layer.name);
    setActiveLayers(activeLayerNames);
  }, [layers]);

  const addLayer = layer => {
    setLayers(prevLayers => [...prevLayers, layer]);
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

  const handleInfo = information => {
    const filteredInfo = {};
    let coordinates = information.coordenadas;

    delete information.coordenadas;
    const formattedInfo = Object.keys(information).reduce((acc, key) => {
      const parts = key.split(".");
      const newKey = parts.slice(0, 1).join(" ");

      acc[newKey] = information[key];
      return acc;
    }, {});

    const newInfo = Object.keys(formattedInfo).reduce((acc, key) => {
      const gna = capitalizeFirstLetter(formattedInfo[key].gna.toLowerCase());
      const nam = formattedInfo[key].nam;
      acc[gna] = nam;
      return acc;
    }, {});
    setInfo({
      ...newInfo,
      Longitud: coordinates.lng,
      Latitud: coordinates.lat,
    });
  };

  const removeLayer = layerName => {
    setLayers(prevLayers =>
      prevLayers.filter(layer => layer.name !== layerName)
    );
  };

  return (
    <MapLayerContext.Provider
      value={{
        layers,
        info,
        baseMapLayer,
        geoserverBaseUrl,
        activeLayers,
        setActiveLayers,
        addLayer,
        removeLayer,
        toggleLayer,
        handleInfo,
      }}
    >
      {children}
    </MapLayerContext.Provider>
  );
};
