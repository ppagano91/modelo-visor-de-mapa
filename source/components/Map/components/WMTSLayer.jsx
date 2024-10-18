import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

import '../../../plugins/leaflet-wmts.js';

const WMTSLayer = ({ url, options }) => {
  const map = useMap();

  useEffect(() => {
    // Crea una nueva instancia de tu capa WMTS
    const wmtsLayer = L.tileLayer.wmts(url, options);

    // Agrega la capa al mapa
    wmtsLayer.addTo(map);

    // Remueve la capa al desmontar el componente
    return () => {
      map.removeLayer(wmtsLayer);
    };
  }, [map, url, options]);

  return null;
};

export default WMTSLayer;
