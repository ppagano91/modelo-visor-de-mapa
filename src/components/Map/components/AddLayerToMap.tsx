import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const AddLayerToMap = ({ layers }) => {
  const map = useMap();

  useEffect(() => {
    const wmsLayers = layers.map((layer) => {
      const wmsLayer = L.tileLayer.wms(layer.url, {
        layers: layer.layers,
        format: 'image/png',
        transparent: true,
        zIndex: 10,
        attribution: layer.attribution,
      });
      wmsLayer.addTo(map);
      return wmsLayer;
    });

    return () => {
      wmsLayers.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [layers, map]);

  return null;
};

export default AddLayerToMap;
