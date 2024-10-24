import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet.locatecontrol'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import L from 'leaflet';

const LocateControl = () => {
  const map = useMap();

  useEffect(() => {
    const locateControl = L.control.locate({
        position: 'bottomright',
        iconElementTag: "div",
        icon:"leaflet-control-locate-button",
        strings: {
            title: "Mi ubicación"
        },
        showPopup: false,
        flyTo: true

    });

    map.addControl(locateControl);

    return () => {
      map.removeControl(locateControl);
    };
  }, []);

  return null;
};

export default LocateControl;
