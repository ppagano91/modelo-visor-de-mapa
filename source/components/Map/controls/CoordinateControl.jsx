import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const CoordinatesControl = ({ position }) => {
  const map = useMap();
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const updateCoordinates = (e) => {
      setCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    };

    map.on('mousemove', updateCoordinates);

    const control = L.Control.extend({
      onAdd: function (map) {
        const element = L.DomUtil.create('div', 'coordinates-control print-hidden');
        element.innerHTML = `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`;
        map.on('mousemove', function (e) {
          element.innerHTML = `Lat: ${e.latlng.lat.toFixed(4)}, Lng: ${e.latlng.lng.toFixed(4)}`;
        });

        return element;
      },
      onRemove: function (map) {
        map.off('mousemove', updateCoordinates);
      }
    });

    const coordinatesControl = new control({ position: position || 'bottomleft' });
    coordinatesControl.addTo(map);

    return () => {
      coordinatesControl.remove();
    };
  }, []);

  return null;
};

export default CoordinatesControl;
