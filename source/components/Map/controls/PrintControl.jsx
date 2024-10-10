import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-easyprint';

const PrintControl = ({ size = 'A4', filename = 'map', printTitle = 'Mapa Impreso' }) => {
  const map = useMap();

  useEffect(() => {
    const printControl = L.easyPrint({
      title: 'Imprimir',
      position: 'bottomright',
      sizeModes: ['Current'],
      customWindowTitle: "Imprimir Mapa",
      spinnerBgColor: "#000000",
    }).addTo(map);

    // Función para agregar el título al mapa antes de imprimir
    const addPrintTitle = () => {
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer) {
        const titleElement = document.createElement('div');
        titleElement.id = 'print-title';
        titleElement.style.position = 'absolute';
        titleElement.style.top = '10px';
        titleElement.style.left = '50%';
        titleElement.style.transform = 'translateX(-50%)';
        titleElement.style.backgroundColor = 'white';
        titleElement.style.padding = '10px';
        titleElement.style.fontSize = '20px';
        titleElement.style.fontWeight = 'bold';
        titleElement.style.zIndex = '9999'; // Asegura que el título esté encima de todo
        titleElement.innerText = printTitle;
        mapContainer.appendChild(titleElement);
      }
    };

    // Función para remover el título después de imprimir
    const removePrintTitle = () => {
      const titleElement = document.getElementById('print-title');
      if (titleElement) {
        titleElement.remove();
      }
    };

    // Agregar la lógica de ocultar controles y agregar título
    const handlePrintClick = () => {
      addPrintTitle(); // Agrega el título antes de la impresión
      setTimeout(() => {
        printControl.printMap(`${size} page`, filename); // Realiza la impresión
      }, 300);

      setTimeout(removePrintTitle, 1000); // Remueve el título después de la impresión
    };

    // Agregar el listener para el botón de impresión
    const printButton = document.querySelector('.leaflet-control-easyPrint-button');
    if (printButton) {
      printButton.addEventListener('click', handlePrintClick);
    }

    return () => {
      // Limpiar el evento al desmontar el componente
      map.removeControl(printControl);
      if (printButton) {
        printButton.removeEventListener('click', handlePrintClick);
      }
    };
  }, [map, size, filename, printTitle]);

  return null;
};

export default PrintControl;
