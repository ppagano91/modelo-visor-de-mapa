import {
  FaRoad,
  FaTrain,
  FaSubway,
  FaTram,
  FaBus,
  FaBusAlt,
  FaTaxi,
  FaParking,
} from "react-icons/fa";
import {
  CloudDownloadOutlined,
  DirectionsBike,
  DirectionsBus,
  DirectionsTransit,
  ElectricBike,
  InfoOutlined,
  LocalParking,
  LocalTaxi,
  PublicOutlined,
  Subway,
  Train,
} from "@mui/icons-material";
import { MdDirectionsBike, MdElectricBike } from "react-icons/md";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import "../../../styles/Layers/Transporte/transporte.css";
import { useContext, useState } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import DownloadModal from "../Modal/DownloadModal";

const Transporte = ({
  onBack,
  color,
  activeTransporteLayers,
  setActiveTransporteLayers,
}) => {
  const mapaServicios =
    "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms?";
  const { toggleLayer } = useContext(MapLayerContext);
  // const mapaServicios = env.REACT_APP_SERVICIOS_MAPA;
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = e => {
    e.stopPropagation();
    setShowModal(true);
  };
  const itemsTransporte = [
    {
      id: 1,
      nombre: "Vías de Circulación",
      icono: <FaRoad />,
      layerProps: null,
    },
    {
      id: 2,
      nombre: "Red de Ferrocarril",
      icono: <Train />,
      layerProps: null,
    },
    {
      id: 3,
      nombre: "Estaciones de Ferrocarril",
      icono: <Train />,
      layerProps: null,
    },
    {
      id: 4,
      nombre: "Red de Subte",

      icono: <Subway />,
      layerProps: {
        name: "red_subte",
        url: mapaServicios,
        layers: "red_subte",
        attribution: "&copy; attribution",
      },
    },
    {
      id: 5,
      nombre: "Red de Premetro",
      icono: <DirectionsTransit />,
      layerProps: null,
    },
    {
      id: 6,
      nombre: "Estaciones de Premetro",
      icono: <DirectionsTransit />,
      layerProps: null,
    },
    {
      id: 7,
      nombre: "Red de Metrobús",
      icono: <DirectionsBus />,
      layerProps: null,
    },
    {
      id: 8,
      nombre: "Estaciones de Metrobús",
      icono: <DirectionsBus />,
      layerProps: null,
    },
    {
      id: 9,
      nombre: "Ciclovías",
      icono: <DirectionsBike />,
      layerProps: null,
    },
    {
      id: 10,
      nombre: "Estaciones Ecobici",
      icono: <ElectricBike />,
      layerProps: null,
    },
    {
      id: 11,
      nombre: "Paradas de Colectivo",
      icono: <DirectionsBus />,
      layerProps: null,
    },
    {
      id: 12,
      nombre: "Paradas de Taxi",
      icono: <LocalTaxi />,
      layerProps: null,
    },
    {
      id: 13,
      nombre: "Estacionamiento de bicis",
      icono: <LocalParking />,
      layerProps: null,
    },
    {
      id: 14,
      nombre: "Estacionamiento permitido",
      icono: <LocalParking />,
      layerProps: null,
    },
    {
      id: 15,
      nombre: "Cortes de tránsito",
      icono: <BiSolidTrafficBarrier />,
      layerProps: null,
    },
  ];

  // const handleToggleLayer = layer => {
  //   toggleLayer(layer);
  // };

  const handleItemClick = (id, layerProps) => {
    setActiveTransporteLayers(prev =>
      prev.includes(id) ? prev.filter(layerId => layerId !== id) : [...prev, id]
    );
    if (layerProps !== null) {
      toggleLayer(layerProps);
    }
  };

  return (
    <div>
      <DownloadModal show={showModal} handleClose={handleModalClose} />
      <div
        className="d-flex m-0 p-2 justify-content-between align-items-center bg-info "
        style={{ backgroundColor: `${color}` }}
      >
        <div className="fs-4 text-light">
          Transporte
          <div className="badge  fs-6  text-dark fw-bold  bg-white opacity-50 px-2 mx-3 ">
            {activeTransporteLayers.length
              ? `${activeTransporteLayers.length}`
              : null}
          </div>
        </div>
        <button
          onClick={onBack}
          type="button"
          className="btn-close btn-close-white p-0 m-2"
          aria-label="Close"
        ></button>
      </div>
      <ul className="m-0 p-0">
        {itemsTransporte.map(item => {
          const isActive = activeTransporteLayers.includes(item.id);
          return (
            <li
              className="d-flex gap-2 m-1 p-1 align-items-center list-item"
              key={item.id}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={item.nombre}
              onClick={() => handleItemClick(item.id, item.layerProps)}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => handleItemClick(item.id, item.layerProps)}
              />
              {item.icono}

              <p className="m-0">{item.nombre}</p>
              <div className="d-flex gap-1 ms-auto">
                <PublicOutlined
                  style={{ height: "16px" }}
                  tooltip="Acceso a Geoservicios"
                />
                <InfoOutlined style={{ height: "16px" }} tooltip="Info" />

                <CloudDownloadOutlined
                  style={{ height: "16px" }}
                  tooltip="Descargar Geoservicios"
                  onClick={e => handleModalShow(e)}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Transporte;
