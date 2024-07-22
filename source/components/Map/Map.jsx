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
import Capas_temporales from "../../assets/images/layer-plus-regular-24.png";

import WMSMap from "../WMSMap";
import { Button } from "react-bootstrap";
import zIndex from "@mui/material/styles/zIndex";
import SelectedLayersSidebar from "../../pages/SelectedLayersSidebar";

import DrawToolbar from "./controls/DrawControl";
import { AppContext } from "../../context/AppContext";

const { BaseLayer, Overlay } = LayersControl;

export default function Map() {
  const { baseMapLayer } = useContext(MapLayerContext);
  const [showModal, setShowModal] = useState(false);
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const { selectedLayers, setSelectedLayers } = useContext(AppContext);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLoadLayer = (url, layerList) => {
    setWmsUrl(url);
    setLayers(layerList);
  };

  const handleSelectLayer = layer => {
    setSelectedLayers(prevLayers => [...prevLayers, { ...layer, url: wmsUrl }]);
  };

  const removeLayer = layerToRemove => {
    setSelectedLayers(prevLayers =>
      prevLayers.filter(
        layer =>
          layer.name !== layerToRemove.name || layer.url !== layerToRemove.url
      )
    );
  };

  return (
    <MapContainer
      className="map-container"
      center={[-34.600174, -58.453122]}
      zoom={15}
      scrollWheelZoom={true}
      attributionControl={false}
    >
      {selectedLayers.map((layer, index) => {
        if (layer.isActive) {
          return (
            <WMSTileLayer
              key={index}
              url={layer.url}
              layers={layer.name}
              format="image/png"
              transparent
              attribution="&copy; attribution"
              zIndex={1000 + index}
            />
          );
        }
      })}

      <Button
        title="Capas Temporales"
        className="btn bg-light  border-2 border-opacity-25 border-black d-flex justify-content-center align-items-center "
        onClick={handleShowModal}
        style={{
          position: "absolute",
          top: "4rem",
          right: ".5rem",
          zIndex: 400,
          width: "50px",
          height: "50px",

          fontSize: "0.7rem",
          lineHeight: "1",
        }}
      >
        <img
          className="  h-auto opacity-75"
          src={Capas_temporales}
          alt=" Capas Temporales"
        />
      </Button>

      <WMSMap
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleLoadLayer={handleLoadLayer}
        handleSelectLayer={handleSelectLayer}
      />

      {/* {selectedLayers.length > 0 && (
        <SelectedLayersSidebar
          selectedLayers={selectedLayers}
          removeLayer={removeLayer}
        />
      )} */}

      <SearchControl />
      <AddBaseLayerToMap />

      <LayersControl
        className="control-layers"
        position="topright"
        zIndex={500}
      >
        <BaseLayer checked name="Mapa Base">
          <WMSTileLayer
            url={baseMapLayer.url}
            layers="mapa_base"
            format="image/png"
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer name="Mapa Satelital">
          <WMSTileLayer
            url={getEnv("VITE_MAPA_SATELITAL")}
            tms={true}
            attribution="imagen satelital"
            zIndex={25}
          />
        </BaseLayer>
      </LayersControl>

      <CoordinatesControl position="bottomleft" />
      <MiniMap position="bottomleft" />
      <ScaleControl position="bottomleft" imperial={false} />

      <DrawToolbar />
      <LocateControl />

      <LinearMeasureControl />
      <InitialView />
      <EasyPrintControl />
    </MapContainer>
  );
}
