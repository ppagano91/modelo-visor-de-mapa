import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const PrintMapButton = ({ position="topleft" }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.Control.extend({
      options: {
        position: position || "bottomright",
      },

      onAdd: function (map) {
        const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");

        const button = L.DomUtil.create("a", "", container);
        button.title = "Imprimir mapa";
        button.style.cursor = "pointer";

        const svgIcon = `
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/>
          </svg>
        `;
        button.innerHTML = svgIcon;

        button.onclick = () => {
          const style = document.createElement('style');
          style.textContent = `
            @media print {
              .leaflet-control, .print-hidden {
                display: none !important;
              }
              @page {
                size: auto;
                margin: 5mm;
              }
              .print-title {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                margin: 0;
                padding: 1rem;
                background: rgb(255, 255, 255);
                opacity: 0.5;
                z-index: 500;
              }
            }
          `;
          document.head.appendChild(style);


          // const title = document.createElement('div');
          // title.className = 'print-title';
          // title.textContent = 'Mapa de la Ciudad de Buenos Aires';
          // document.body.appendChild(title);

          window.print();

          setTimeout(() => {
            document.head.removeChild(style);
            // document.body.removeChild(title);
          }, 1500);
        };

        return container;
      },

      onRemove: function (map) {
        // Opcional: Código para limpiar el control
      },
    });

    const customControl = new control({ position });
    customControl.addTo(map);

    return () => {
      customControl.remove();
    };
  }, [position, map]);

  return null;
};

export default PrintMapButton;
