import { useContext, useEffect } from "react";
import { MapLayerContext } from "../context/MapLayerContext";
import { Info } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Popup, useMap, WMSTileLayer } from "react-leaflet";
import { getEnv } from "../config";

const UpdateMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 18);
    }
  }, [position, map]);

  return null;
};

const MasInformacion = () => {
  const { info, resetInfo, baseMapLayer } = useContext(MapLayerContext);

  const renderMap = () => {
    if (!info.Longitud || !info.Latitud) {
      return null;
    }

    const position = [info.Latitud, info.Longitud];

    return (
      <MapContainer
        center={position}
        style={{ height: "10rem", width: "100%", position: "relative" }}
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        attributionControl={false}
        className="border border-dark rounded"
      >
        <WMSTileLayer
          url={baseMapLayer.url}
          layers={baseMapLayer.name}
          format="image/png"
          transparent={true}
        />
        <Marker position={position} interactive={false} />
        <UpdateMap position={position} />
      </MapContainer>
    );
  };

  return (
    <div className="masinfo-wrapper">
      {Object.keys(info).length === 0 ? (
        <div
          className="d-flex flex-column justify-content-center p-3"
          style={{ width: "21rem", position: "relative" }}
        >
          <div className="status status-info mt-4" />

          <h2
            className="status-title mt-3" style={{color:'#101E37'}}>
            Mas información
          </h2>

          <p className="masinfo-texto mt-2" style={{color:'#101E37'}} >
            Puede acceder a <b>información contextual</b> haciendo "<i>click</i> derecho" sobre alguna capa temática de la sección <b>"Capas"</b>.
          </p>
        </div>
      ) : (
        <div
          className="d-flex flex-column p-3 h-100"
          style={{ width: "21rem", position: "relative" }}
        >
          <div>{renderMap()}</div>

          <div className="mt-4" style={{ flex: 1, overflowY: "auto" }}>
            <div className="d-flex flex-row justify-content-between align-items-center mb-2">
              <div className="d-flex flex-row align-items-center gap-2">
                <h3>Información</h3>
                <Info />
              </div>
              <div className="">
                <button
                  onClick={() => {
                    resetInfo();
                  }}
                  type="button"
                  className="btn-close btn-close-black p-0"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <ul className="p-0 m-0" style={{ maxHeight: "21rem", overflowY: "auto" }}>
              {Object.keys(info).map((key) => (
                <li style={{ listStyle: "none", marginRight: "0.25rem" }} key={key}>
                  <div className="d-flex justify-content-between masinfo-items">
                    <p className="p-0 m-0">
                      <b>{key}</b>:
                    </p>
                    <p>{info[key]}</p>
                  </div>
                  <hr className="p-0 m-0" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasInformacion;
