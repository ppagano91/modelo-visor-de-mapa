import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-easyprint';

const PrintControl = ({ size = 'A4', filename = 'map' }) => {
  const map = useMap();

  useEffect(() => {
    const printControl = L.easyPrint({
      title: 'Imprimir mapa',
      position: 'bottomright',
      sizeModes: ['Current', 'A4Portrait', 'A4Landscape'],
    },
  ).addTo(map);

    const hideControls = () => {
      console.log(searchControl)
      const searchControl = document.querySelector('.search-control');
      const wmsMap = document.querySelector('.wms-map');

      if (searchControl) searchControl.classList.add('print-hidden-control');
      if (wmsMap) wmsMap.classList.add('print-hidden-control');
    };

    // Función para mostrar nuevamente los controles personalizados
    const showControls = () => {
      const searchControl = document.querySelector('.search-control');
      const wmsMap = document.querySelector('.wms-map');

      if (searchControl) searchControl.classList.remove('print-hidden-control');
      if (wmsMap) wmsMap.classList.remove('print-hidden-control');
    };

    // Función personalizada para manejar la impresión con ocultar/mostrar controles
    const handlePrintClick = (e) => {
      hideControls(); // Oculta los controles personalizados antes de la impresión
      setTimeout(() => {
        printControl.printMap(`${size} page`, filename); // Llama a la función de impresión
      }, 300);

      setTimeout(showControls, 1000); // Muestra los controles después de la impresión
    };

    // Acceder al botón de impresión y asignar el evento click personalizado
    const printButton = document.querySelector('.leaflet-control-easyPrint-button');
    if (printButton) {
      printButton.addEventListener('click', handlePrintClick);
    }

    return () => {
      // Remover el control de impresión del mapa
      map.removeControl(printControl);

      // Remover el listener de click cuando el componente se desmonta
      if (printButton) {
        printButton.removeEventListener('click', handlePrintClick);
      }
    };
  }, [map, size, filename]);

  return null; // No renderiza nada visualmente
};

export default PrintControl;
