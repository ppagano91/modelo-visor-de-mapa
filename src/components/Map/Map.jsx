  import { useContext, useEffect } from 'react';
  import { ScaleControl } from "react-leaflet/ScaleControl";
  import {
    MapContainer,
    TileLayer,
    LayersControl,
    useMap,
    WMSTileLayer
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
  import SearchControl from './controls/SearchControl';

  import {getEnv} from "../../config"

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

      const onMapClick = async (event) => {
        const latlng = event.latlng;
        const mapSize = map.getSize();
        const mapBounds = map.getBounds();
        const bbox = mapBounds.toBBoxString();

        for (let wmsLayer of wmsLayers) {
          const point = map.latLngToContainerPoint(latlng, map.getZoom());

          const params = {
            service: 'WMS',
            version: '1.1.1',
            request: 'GetFeatureInfo',
            format: 'image/png',
            transparent: true,
            query_layers: wmsLayer.wmsParams.layers,
            styles: '',
            layers: wmsLayer.wmsParams.layers,
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

          const url = wmsLayer._url + L.Util.getParamString(params, wmsLayer._url, true);

          try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data.features); // Aquí puedes manejar los datos como desees
          } catch (error) {
            console.error('Error fetching feature info:', error);
          }
        }
      };

      map.on('click', onMapClick);

      return () => {
        map.off('click', onMapClick);
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
        <MapContainer className="map-container" center={[-34.600174, -58.453122]} zoom={15} scrollWheelZoom={true} attributionControl={false}>
          <SearchControl />
          <AddLayerToMap layers={layers} />
          <LayersControl className="control-layers" position="topright">
            <BaseLayer checked name="Mapa Base">
              <WMSTileLayer 
                url={getEnv("VITE_MAPA_BASE")}
                layers="mapa_base"
                format="image/png"
                transparent={true}
              />
            </BaseLayer>
            <BaseLayer name="Mapa Topográfico">
              <TileLayer url={tileLayers.baseLayers.openTopoMap.map} transparent={true}/>
            </BaseLayer>
            <BaseLayer name="Mapa Satelital">
              <TileLayer
                // url={tileLayers.baseLayers.esri.worldImagery.map}
                url={getEnv("VITE_MAPA_SATELITAL")}
                tms={true}
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
          <CoordinatesControl position="bottomleft" />
          <MiniMap position="bottomleft" />
          <ScaleControl position="bottomleft" imperial={false} />
        </MapContainer>
        
    );
  }
