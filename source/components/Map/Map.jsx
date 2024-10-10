import { useContext, useRef, useState } from "react";
import { ScaleControl } from "react-leaflet/ScaleControl";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMap,
  WMSTileLayer,
} from "react-leaflet";

import "../../styles/map.css";
import MiniMap from "./controls/MiniMap";
import CoordinatesControl from "./controls/CoordinateControl";
import InitialView from "./controls/InitialView";
import LinearMeasureControl from "./controls/LinearMeasurementControl";

import LocateControl from "./controls/LocateControl";
import { MapLayerContext } from "../../context/MapLayerContext";
import SearchControl from "./controls/SearchControl";
import { getEnv } from "../../config";
import AddBaseLayerToMap from "./components/AddBaseLayerToMap";

import WMSMap from "../WMSMap";

import DrawToolbar from "./controls/DrawControl";
import { AppContext } from "../../context/AppContext";
import PrintControl from "./controls/PrintControl";
import WMSControl from "./controls/WMSControl";

// import PrintControlDefault from "react-leaflet-easyprint"

const { BaseLayer, Overlay } = LayersControl;

// const PrintControl = withLeaflet(PrintControlDefault);

export default function Map() {
  const { baseMapLayer } = useContext(MapLayerContext);
  const [showModal, setShowModal] = useState(false);
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const { selectedLayers, setSelectedLayers } = useContext(AppContext);
  // const printControlRef = useRef();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleLoadLayer = (url, layerList) => {
    setWmsUrl(url);
    setLayers(layerList);
  };

  const handleSelectLayer = layer => {
    setSelectedLayers(prevLayers => [...prevLayers, { ...layer, url: wmsUrl }]);
  };


  return (
    <MapContainer
      className="map-container"
      center={[-34.600174, -58.453122]}
      zoom={12}
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
      
      <WMSControl handleClick={handleShowModal} />
      <WMSMap
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleLoadLayer={handleLoadLayer}
        handleSelectLayer={handleSelectLayer}
      />
      

      <SearchControl className="search-control leaflet-control" />
      <AddBaseLayerToMap />

      <LayersControl
        className="control-layers"
        position="topright"
        zIndex={500}
      >
        <BaseLayer checked name="Mapa Base">
          <WMSTileLayer
            url={baseMapLayer.url}
            layers={baseMapLayer.name}
            format="image/png"
            transparent={true}
          />
        </BaseLayer>        
        <BaseLayer name="ArgenMap">
          <WMSTileLayer
            url={getEnv("VITE_ARGENMAP")}
            attribution="&copy; IGN https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/ServiciosOGC"
            zIndex={25}
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

      <CoordinatesControl position="bottomleft" className="print-hidden"/>
      <MiniMap position="bottomleft" />
      <ScaleControl position="bottomleft" imperial={false} />

      <DrawToolbar />
      <LocateControl />

      <LinearMeasureControl />
      <InitialView />
      <PrintControl />
    </MapContainer>
  );
}
