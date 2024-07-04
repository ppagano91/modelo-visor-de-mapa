import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import '../../../styles/plugins/leaflet-draw.css';
import "../../../plugins/leaflet-draw.js";

const DrawToolbar = () => {
  const map = useMap();

  useEffect(() => {
    // Inicializar la barra de herramientas de dibujo
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: new L.FeatureGroup().addTo(map),
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false,
      },
      position: "bottomright"
    });

    // Añadir la barra de herramientas de dibujo al mapa
    map.addControl(drawControl);

    // Event handler para guardar los elementos dibujados
    map.on(L.Draw.Event.CREATED, (event) => {
      const { layer } = event;
      const drawnItems = drawControl.options.edit.featureGroup;
      drawnItems.addLayer(layer);
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map]);

  return null;
};

export default DrawToolbar;
