import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import '../../../plugins/leaflet-easyprint';
import L from "leaflet";

const PrintMapButton = ({ position = "bottomright" }) => {
  const map = useMap();

  useEffect(() => {
    const easyPrint = L.easyPrint({
      printHeader: 'Mapa de la Ciudad de Buenos Aires',
      title: 'Imprimir mapa',
      position: position || 'bottomright',
      exportOnly: false,
      hideControlContainer: true,
      sizeModes: ['Current'],
      filename: 'mapa',
      exportType: 'png',
      printLayer: true,
    }).addTo(map);

    return () => {
      easyPrint.remove();
    };
  }, [map, position]);

  return null;
};

export default PrintMapButton;
