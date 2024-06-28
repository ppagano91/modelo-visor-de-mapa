import React, { useEffect, useContext } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapLayerContext } from '../../../context/MapLayerContext';

const AddLayerToMap = () => {
  const map = useMap();
  const { layers } = useContext(MapLayerContext);

  const onMapRightClick = async (event) => {
    const latlng = event.latlng;
    const mapSize = map.getSize();
    const mapBounds = map.getBounds();
    const bbox = mapBounds.toBBoxString();
    const point = map.latLngToContainerPoint(latlng);

    layers.forEach(async (layer) => {
      const params = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        format: 'image/png',
        transparent: true,
        query_layers: layer.layers,
        styles: '',
        layers: layer.layers,
        exceptions: 'application/vnd.ogc.se_inimage',
        info_format: 'application/json',
        feature_count: 50,
        srs: 'EPSG:4326',
        bbox: bbox,
        width: mapSize.x,
        height: mapSize.y,
        x: Math.round(point.x),
        y: Math.round(point.y),
      };

      const url = layer.url + L.Util.getParamString(params, '', true);

      try {
        const response = await fetch(url);
        const text = await response.text();
        const data = JSON.parse(text);
        const mappedFeatures = {};

        data.features.forEach((feature) => {
          const { id, geometry, properties } = feature;
          mappedFeatures[id] = {
            ...properties,
            geometry,
          };
        });

        console.log(mappedFeatures);
      } catch (error) {
        console.error('Error fetching feature info:', error);
      }
    });
  };

  useEffect(() => {
    const wmsLayers = layers.map((layer) => {
      const wmsLayer = L.tileLayer.wms(layer.url, {
        layers: layer.layers,
        format: 'image/png',
        transparent: true,
        zIndex: 10,
        attribution: layer.attribution,
      });
      wmsLayer.addTo(map);
      return wmsLayer;
    });

    map.on('contextmenu', onMapRightClick);

    return () => {
      map.off('contextmenu', onMapRightClick);
      wmsLayers.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [layers, map]);

  return null;
};

export default AddLayerToMap;
