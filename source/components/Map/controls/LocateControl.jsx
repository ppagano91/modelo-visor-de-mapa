import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import L from 'leaflet';

const LocateControl = () => {
  const map = useMap();

  useEffect(() => {
    const locateControl = L.control.locate({
      position: 'bottomright',
      iconElementTag: "div",
      icon: "leaflet-control-locate-button",
      strings: {
        title: "",
      },
      showPopup: false,
      flyTo: true,
    });

    map.addControl(locateControl);

    // Seleccionar el botón de localización después de que se haya agregado al mapa
    const locateButton = document.querySelector('.leaflet-control-locate');
    const showTooltip = () => {
      // Muestra el tooltip
      wrapper.style.visibility = 'visible';
    };
    const hideTooltip = () => {
      // Oculta el tooltip
      wrapper.style.visibility = 'hidden'; 
    };
    if (locateButton) {
      // Crear un wrapper para el tooltip
      locateButton.setAttribute("data-direction", "left");
      locateButton.setAttribute("data-tooltip", "Mi Ubicación");

     
    }

    return () => {
      map.removeControl(locateControl);
      if (locateButton) {
        locateButton.removeEventListener('mouseenter', showTooltip);
        locateButton.removeEventListener('mouseleave', hideTooltip);
      }
    };
  }, [map]);

  return null;
};

export default LocateControl;