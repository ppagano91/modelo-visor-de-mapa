import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import "../../../plugins/LinearMeasurement.js";
import L from "leaflet";

const LinearMeasureControl = () => {
  const map = useMap();

  useEffect(() => {
    const measureControl = new L.Control.LinearMeasurement({
      unitSystem: "metric",
      color: "#007BC7",
      show_last_node: true,
      show_azimut: false,
      doubleClickSpeed: 500,
      position: "bottomright",
    });
    measureControl.addTo(map);
    return () => {
      measureControl.remove();
    };
  }, []);

  return null;
};

export default LinearMeasureControl;
