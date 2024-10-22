import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../../../plugins/leaflet-wmts.js';

const WMTSLayer = ({ url, options }) => {
    const map = useMap();

    useEffect(() => {
        const wmtsLayer = L.tileLayer.wmts(url, options);
        wmtsLayer.addTo(map);

        return () => {
            map.removeLayer(wmtsLayer);
        };
    }, [map, url, options]);

    return null;
};

export default WMTSLayer;
