import React, { useEffect, useContext } from 'react';
import { MapLayerContext } from '../../../context/MapLayerContext';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getEnv } from "../../../config";
import { AppContext } from '../../../context/AppContext';
import { PATHS } from '../../../utils/consts/paths';

const AddBaseLayerToMap = () => {
  const map = useMap();
  const { openSection } = useContext(AppContext)
  const { layers, resetInfo, handleInfoWMSLayers, handleSetMarker } = useContext(MapLayerContext);

  const onMapRightClick = async (event) => {

    if (event.originalEvent.target.tagName === 'INPUT') {
      //Al hacer click derecho en el Input no marca el mapa
      return
    }

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

    const marker = L.marker(latlng).addTo(map);

    marker.on('click', () => {
      map.removeLayer(marker);
      resetInfo();
    });

    handleSetMarker(marker);

    map.setView(latlng);

    let layerClicked = false;

    for (const layer of layers) {
      const params = {
        service: 'WMS',
        version: '1.1.0',
        request: 'GetFeatureInfo',
        format: 'image/png',
        transparent: true,
        query_layers: layer.name,
        styles: '',
        layers: layer.name,
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
          openSection(PATHS.masInformacion);
          break;
        }
      } catch (error) {
        console.error('Error al obtener datos de las capas:', error);
      }
    }
  };

  useEffect(() => {
    const wmsLayers = layers.map((layer) => {
      const wmsLayer = L.tileLayer.wms(layer.url, {
        layers: layer.name,
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
  }, [layers]);

  return null;
};

export default AddBaseLayerToMap;
