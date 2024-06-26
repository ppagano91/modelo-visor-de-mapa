import React, { useEffect, useContext } from 'react';
import { MapLayerContext } from '../../../context/MapLayerContext';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const AddBaseLayerToMap = ({ baseLayerUrl, layerName }) => {
  const map = useMap();
  const {handleInfo} = useContext(MapLayerContext);


  const proxiedBaseLayerUrl = `/geoserver${new URL(baseLayerUrl).pathname}`;

  const onMapRightClick = async (event) => {
    const latlng = event.latlng;
    const mapSize = map.getSize();
    const mapBounds = map.getBounds();
    const bbox = mapBounds.toBBoxString();

    const point = map.latLngToContainerPoint(latlng);

    const params = {
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      format: 'image/png',
      transparent: true,
      query_layers: layerName,
      styles: '',
      layers: layerName,
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

    const url = proxiedBaseLayerUrl + L.Util.getParamString(params, '', true);

    try {
      const response = await fetch(url);
      const text = await response.text();

      const data = JSON.parse(text);
      const mappedFeatures = {};

      data.features.forEach(feature => {
      const { id, geometry, properties } = feature;
      mappedFeatures[id] = {
          ...properties,
          geometry
      };

      console.log(mappedFeatures);
      handleInfo(mappedFeatures);
      });
    } catch (error) {
      console.error('Error fetching feature info:', error);
    }
  };

  useEffect(() => {
    
    const baseLayer = L.tileLayer.wms(proxiedBaseLayerUrl, {
      layers: layerName,
      format: 'image/png',
      transparent: true,
      zIndex: 10,
      attribution: '&copy; attribution',
    });

    baseLayer.addTo(map);

    

    map.on('contextmenu', onMapRightClick);

    return () => {
      map.off('contextmenu', onMapRightClick);
      map.removeLayer(baseLayer);
    };
  }, [onMapRightClick]);

  return null;
};

export default AddBaseLayerToMap;