import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "../../../plugins/leaflet.browser.print";
import "../../../plugins/leaflet.browser.print.css";

const EasyPrintControl = () => {
  const map = useMap();
  const printControlRef = useRef(null);

  useEffect(() => {
    if (L.control.browserPrint && !printControlRef.current) {
      console.log("Añadiendo control de impresión");
      printControlRef.current = L.control
        .browserPrint({
          title: "Imprimir Mapa",
          position: "bottomright",
          modal: true,
          printModes: [
            L.BrowserPrint.Mode.Portrait("A4", { title: "Vertical" }),
            L.BrowserPrint.Mode.Landscape("A4", { title: "Horizontal" }),
            L.BrowserPrint.Mode.Custom("B5", { title: "Seleccione una area" }),
          ],
          manualMode: false,
        })

        .addTo(map);
    } else if (!L.control.browserPrint) {
      console.log("leaflet.browser.print.js no se cargó correctamente.");
    } else {
      console.log("El control de impresión ya existe en el mapa.");
    }

    return () => {
      if (printControlRef.current) {
        map.removeControl(printControlRef.current);
        printControlRef.current = null;
      }
    };
  }, [map]);

  return null;
};

export default EasyPrintControl;
