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
  const { info, resetInfo } = useContext(MapLayerContext);

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
          url={getEnv("VITE_MAPA_BASE")}
          layers="mapa_base_prod"
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
          className="d-flex flex-column justify-content-center align-items-center p-2 h-100"
          style={{ width: "21rem", position: "relative" }}
        >
          <Info className="m-2" />
          <p className="text-justify p-2 masinfo-texto">
            Puede acceder a <b>información contextual</b> haciendo "<i>click</i> derecho" sobre un punto del mapa.
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
            <ul className="p-0 m-0" style={{ maxHeight: "21rem", overflowY: "auto"}}>
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
