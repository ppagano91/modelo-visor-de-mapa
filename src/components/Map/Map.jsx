import { useContext, useEffect } from 'react';
import { ScaleControl } from "react-leaflet/ScaleControl";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap
} from "react-leaflet";
import L from "leaflet"

import "../../styles/map.css";
import MiniMap from "./controls/MiniMap";
import CoordinatesControl from "./controls/CoordinateControl";
import InitialView from "./controls/InitialView";
import LinearMeasureControl from "./controls/LinearMeasurementControl";
import LocateControl from "./controls/LocateControl";
import { MapLayerContext } from '../../context/MapLayerContext';
import { tileLayers } from '../../utils/consts/consts'

const { BaseLayer, Overlay } = LayersControl;

const AddLayerToMap = ({ layers }) => {
  const map = useMap();

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

    return () => {
      wmsLayers.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [layers, map]);

  return null;
};

export default function Map() {
  const { layers } = useContext(MapLayerContext);
  return (
      <MapContainer className="map-container" center={[-34.600174, -58.453122]} zoom={15} scrollWheelZoom={true}>
        <AddLayerToMap layers={layers} />
        <LayersControl className="control-layers" position="topright">
          <BaseLayer checked name="Mapa Base">
            <TileLayer url={tileLayers.baseLayers.default.map} />
          </BaseLayer>
          <BaseLayer name="Mapa Topográfico">
            <TileLayer url={tileLayers.baseLayers.openTopoMap.map} transparent={true}/>
          </BaseLayer>
          <BaseLayer name="Mapa Satelital">
            <TileLayer
              url={tileLayers.baseLayers.esri.worldImagery.map}
              attribution={tileLayers.baseLayers.esri.worldImagery.attribution}
            />
          </BaseLayer>
          <BaseLayer name="Mapa Watercolor">
            <TileLayer
              url={tileLayers.baseLayers.stadia.map.Watercolors}
              attribution={tileLayers.baseLayers.esri.worldImagery.attribution}
            />
          </BaseLayer>
        </LayersControl>
        <InitialView />
        <LocateControl />
        <LinearMeasureControl />
        <CoordinatesControl position="bottomright" />
        <MiniMap position="bottomright" />
        <ScaleControl position="bottomright" imperial={false} />
      </MapContainer>
      
  );
}
