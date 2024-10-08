import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-minimap';

const MiniMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    const minimapLayer = new L.TileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
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
