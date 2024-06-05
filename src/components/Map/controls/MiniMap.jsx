import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-minimap';

const MiniMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    const minimapLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 0,
      maxZoom: 13,
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
