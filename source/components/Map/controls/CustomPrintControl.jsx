import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import html2canvas from 'html2canvas';
import L from 'leaflet';

const CustomPrintControl = () => {
  const map = useMap();

  // Función para imprimir el mapa
  const printMap = async () => {
    const mapContainer = document.querySelector('.leaflet-container');

    // Captura el mapa y lo convierte en un canvas
    try {
      const canvas = await html2canvas(mapContainer, {
        useCORS: true, // Habilita el uso de CORS para cargar imágenes
        scale: 2 // Aumenta la escala para mejor calidad
      });
      const imgData = canvas.toDataURL('image/png');

      // Crear un iframe oculto para la impresión
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      // Escribir el contenido en el iframe
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(`
        <html>
          <head>
            <title>Imprimir Mapa</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: white;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
          </body>
        </html>
      `);
      doc.close(); // Cierra el documento para que se renderice

      // Abre la ventana de impresión
      iframe.contentWindow.onload = () => {
        iframe.contentWindow.print(); // Llama a la función de impresión
        document.body.removeChild(iframe); // Elimina el iframe después de la impresión
      };
    } catch (error) {
      console.error("Error al capturar el mapa:", error);
    }
  };

  // Efecto para agregar el botón de impresión al mapa
  useEffect(() => {
    // Crear el botón
    const printButton = L.control({ position: 'topright' });
    printButton.onAdd = function() {
      const div = L.DomUtil.create('div', 'custom-print-button');
      div.innerHTML = '<button style="background: white; border: 1px solid black;">Imprimir Mapa</button>';
      div.onclick = printMap; // Llama a la función de impresión
      return div;
    };
    printButton.addTo(map);

    // Limpiar el botón al desmontar
    return () => {
      map.removeControl(printButton);
    };
  }, [map]);

  return null;
};

export default CustomPrintControl;
