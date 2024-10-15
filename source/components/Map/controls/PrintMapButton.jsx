import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
// import 'leaflet-easyprint';
import '../../../plugins/leaflet-easyprint';
import L from "leaflet";

const PrintMapButton = ({ position = "topleft" }) => {
  const map = useMap();

  useEffect(() => {
    // Configurar EasyPrint
    const easyPrint = L.easyPrint({
      printHeader: 'Mapa de la Ciudad de Buenos Aires',
      title: 'Imprimir mapa',
      position: position || 'bottomright',
      exportOnly: false,
      hideControlContainer: true,
      sizeModes: ['Current'], // Solo usar el tamaño actual del mapa
      filename: 'mapa',
      exportType: 'png',
      printLayer: true, // Asegura que las capas vectoriales se impriman
    }).addTo(map);

    return () => {
      easyPrint.remove();
    };
  }, [map, position]);

  return null;
};

export default PrintMapButton;
