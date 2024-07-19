import React, { useEffect, useContext } from 'react';
import { MapLayerContext } from '../../../context/MapLayerContext';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getEnv } from "../../../config";

const AddBaseLayerToMap = () => {
  const map = useMap();
  const { layers, handleInfoBaseMap, handleInfoWMSLayers, geoserverBaseUrl, baseMapLayer, setGeoserverBaseUrl } = useContext(MapLayerContext);
  // let geoserverBaseUrl;
  // useEffect(() => {
  //   geoserverBaseUrl = getEnv("VITE_GEOSERVER_URL");
  //   const proxiedBaseLayerUrl = geoserverBaseUrl
  //     ? `${geoserverBaseUrl}${new URL(baseMapLayer.url).pathname}`
  //     : `/geoserver${new URL(baseMapLayer.url).pathname}`;

  //   setGeoserverBaseUrl(proxiedBaseLayerUrl);
  // }, []);

  const onMapRightClick = async (event) => {
    const latlng = event.latlng;
    const mapSize = map.getSize();
    const mapBounds = map.getBounds();
    const bbox = mapBounds.toBBoxString();
    const point = map.latLngToContainerPoint(latlng);

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    let layerClicked = false;

    const marker = L.marker(latlng).addTo(map);

    map.setView(latlng);

    for (const layer of layers) {
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

        if (data.features && data.features.length > 0) {
          layerClicked = true;
          const mappedFeatures = {};
          data.features.forEach((feature) => {
            const { id, geometry, properties } = feature;
            mappedFeatures[id] = {
              ...properties,
              geometry,
            };
          });
          handleInfoWMSLayers({ ...mappedFeatures, coordenadas: latlng });
          break;
        }
      } catch (error) {
        console.error('Error fetching feature info:', error);
      }
    }

    if (!layerClicked) {
      const params = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        format: 'image/png',
        transparent: true,
        query_layers: baseMapLayer.name,
        styles: '',
        layers: baseMapLayer.name,
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

      const url = geoserverBaseUrl + L.Util.getParamString(params, '', true);

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
        handleInfoBaseMap({ ...mappedFeatures, coordenadas: latlng });
      } catch (error) {
        console.error('Error fetching feature info:', error);
      }
    }
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

    // Añadir capa base al mapa
    // const baseLayer = L.tileLayer.wms(baseMapLayer.url, {
    //   layers: baseMapLayer.name,
    //   format: 'image/png',
    //   transparent: true,
    //   zIndex: 5,
    //   attribution: '&copy; attribution',
    // });
    // baseLayer.addTo(map);

    map.on('contextmenu', onMapRightClick);

    return () => {
      map.off('contextmenu', onMapRightClick);
      wmsLayers.forEach((layer) => {
        map.removeLayer(layer);
      });
      // map.removeLayer(baseLayer);
    };
  }, [layers]);

  return null;
};

export default AddBaseLayerToMap;
