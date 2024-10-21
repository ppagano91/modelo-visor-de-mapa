import { useContext, useRef, useState } from "react";
import { ScaleControl } from "react-leaflet/ScaleControl";
import {
  MapContainer,
  LayersControl,
  WMSTileLayer,
  TileLayer
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
import WMSControl from "./controls/WMSControl";
import PrintMapButton from "./controls/PrintMapButton";
import WMTSLayer from "./components/WMTSLayer";

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


  const captureMapImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = mapRef.current.leafletElement.getSize()[0];
    canvas.height = mapRef.current.leafletElement.getSize()[1];

    const ctx = canvas.getContext('2d');
    mapRef.current.leafletElement._container.style.position = 'absolute';
    mapRef.current.leafletElement._container.style.top = '0px';
    mapRef.current.leafletElement._container.style.left = '0px';

    ctx.drawImage(mapRef.current.leafletElement._tilePane, 0, 0);
    
    return canvas.toDataURL();
  };
  const centerCoords=getEnv("VITE_CENTRO_CABA").split(",")


  return (
    <MapContainer
      maxZoom={19}
      minZoom={0}
      className="map-container"
      center={[centerCoords[0], centerCoords[1]]}
      zoom={12}
      scrollWheelZoom={true}
      attributionControl={false}
      zoomSnap={0.1}
      zoomDelta={0.1}
      zoomAnimation={true}
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
        <BaseLayer name="Mapa Base TMS">
          <WMSTileLayer
            url={getEnv("VITE_MAPA_BASE_TMS")}
            tms={true}
            attribution="&copy; <a href='http://geoserver.buenosaires.gob.ar'>Geoserver Buenos Aires</a>"
            updateWhenIdle={true}
          />
        </BaseLayer>
        <BaseLayer name="Mapa Base WMTS">
          <TileLayer
            url={getEnv("VITE_MAPA_BASE_WMTS")}
            tileSize={256}
            attribution="&copy; <a href='https://www.buenosaires.gob.ar'>Gobierno de la Ciudad de Buenos Aires</a>"
            updateWhenIdle={true}
            maxZoom={31}
            minZoom={0}
          />
      </BaseLayer>   
        <BaseLayer name="ArgenMap">
          <WMSTileLayer
            url={getEnv("VITE_ARGENMAP")}
            attribution="&copy; <a href='https://www.ign.gob.ar/NuestrasActividades/InformacionGeoespacial/ServiciosOGC>IGN</a>"
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

      <CoordinatesControl position="bottomleft"/>
      <MiniMap position="bottomleft" />
      <ScaleControl position="bottomleft" imperial={false} />

      <DrawToolbar />
      <LocateControl />

      <LinearMeasureControl />
      <InitialView />
      <PrintMapButton />
    </MapContainer>
  );
}
