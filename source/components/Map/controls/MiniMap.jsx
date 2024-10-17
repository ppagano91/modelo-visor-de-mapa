import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-minimap';
import { getEnv } from '../../../config';

const MiniMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    const minimapLayer = new L.TileLayer(getEnv("VITE_ARGENMAP"), {
      minZoom: 0,
      maxZoom: 13,
      // bounds: map.getBounds()
    });

    const miniMap = new L.Control.MiniMap(minimapLayer,
      {
        toggleDisplay: true,
        minimized: true,
        position: position || 'topright',
        strings:{hideText:"Ocultar Mini Mapa",showText:"Mostrar Mini Mapa"}
      }
  );

    miniMap.addTo(map);

    return () => {
      miniMap.remove();
    };
  }, []);

  return null;
};

export default MiniMap;
