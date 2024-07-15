import { useContext, useState } from "react";
import { ScaleControl } from "react-leaflet/ScaleControl";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap,
  WMSTileLayer,
} from "react-leaflet";
import L from "leaflet";

import "../../styles/map.css";
import MiniMap from "./controls/MiniMap";
import CoordinatesControl from "./controls/CoordinateControl";
import InitialView from "./controls/InitialView";
import LinearMeasureControl from "./controls/LinearMeasurementControl";

import LocateControl from "./controls/LocateControl";
import { MapLayerContext } from "../../context/MapLayerContext";
import { tileLayers } from "../../utils/consts/consts";
import SearchControl from "./controls/SearchControl";
import { getEnv } from "../../config";
import AddBaseLayerToMap from "./components/AddBaseLayerToMap";
import EasyPrintControl from "./controls/EasyPrintControl";

import WMSMap from "../WMSMap";
import { Button } from "react-bootstrap";
import zIndex from "@mui/material/styles/zIndex";
import SelectedLayersSidebar from "./components/SelectedLayersSidebar";

import DrawToolbar from "./controls/DrawControl";

const { BaseLayer, Overlay } = LayersControl;

export default function Map() {
  const { baseMapLayer } = useContext(MapLayerContext);
  const [showModal, setShowModal] = useState(false);
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);

  console.log("selectedLayers:", selectedLayers);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLoadLayer = (url, layerList) => {
    setWmsUrl(url);
    setLayers(layerList);
  };

  const handleSelectLayer = layer => {
    setSelectedLayers([...selectedLayers, layer]);
  };

  const removeLayer = layer => {
    setSelectedLayers(selectedLayers.filter(l => l !== layer));
  };

  return (
    <MapContainer
      className="map-container"
      center={[-34.600174, -58.453122]}
      zoom={15}
      scrollWheelZoom={true}
      attributionControl={false}
    >
      {selectedLayers.map((layer, index) => (
        <WMSTileLayer
          key={index}
          url={wmsUrl}
          layers={layer.name}
          format="image/png"
          transparent
          attribution="&copy; attribution"
          zIndex={1000 + index}
        />
      ))}

      <Button
        className="btn btn-light btn-sm w-30"
        onClick={handleShowModal}
        style={{
          position: "absolute",
          top: "4rem",
          right: ".5rem",
          zIndex: 1000,
        }}
      >
        Capas Temporales
      </Button>

      <WMSMap
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleLoadLayer={handleLoadLayer}
        handleSelectLayer={handleSelectLayer}
      />

      {selectedLayers?.length > 0 && (
        <SelectedLayersSidebar
          selectedLayers={selectedLayers}
          removeLayer={removeLayer}
        />
      )}

      <SearchControl />
      <AddBaseLayerToMap />

      <LayersControl className="control-layers" position="topright">
        <BaseLayer checked name="Mapa Base">
          <WMSTileLayer
            url={baseMapLayer.url}
            layers="mapa_base"
            format="image/png"
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer name="Mapa Topográfico">
          <WMSTileLayer
            url={tileLayers.baseLayers.openTopoMap.map}
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer name="Mapa Satelital">
          <WMSTileLayer
            url={tileLayers.baseLayers.esri.worldImagery.url}
            tms={true}
            attribution={tileLayers.baseLayers.esri.worldImagery.attribution}
          />
        </BaseLayer>
        <BaseLayer name="Mapa Watercolor">
          <WMSTileLayer
            url={tileLayers.baseLayers.stadia.map.Watercolors}
            attribution={tileLayers.baseLayers.esri.worldImagery.attribution}
          />
        </BaseLayer>
      </LayersControl>

      <DrawToolbar />
      <InitialView />
      <LocateControl />
      <LinearMeasureControl />

      <CoordinatesControl position="bottomleft" />
      <MiniMap position="bottomleft" />
      <ScaleControl position="bottomleft" imperial={false} />

      <EasyPrintControl position="bottomright" />
    </MapContainer>
  );
}
