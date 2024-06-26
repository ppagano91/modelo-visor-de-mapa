import { FaHouse } from "react-icons/fa6";
import { BsFillHousesFill } from "react-icons/bs";
import { GiPlantRoots } from "react-icons/gi";
import React, { useState } from "react";
import { useContext } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import {
  Home,
  Settings,
  NaturePeople,
  LocationCity,
  RadioButtonChecked,
  SupervisedUserCircle,
  AccountBalance,
  CloudDownload,
  Info,
  InfoOutlined,
  InfoSharp,
  Public,
  CloudDownloadOutlined,
  PublicOffOutlined,
  PublicOutlined,
} from "@mui/icons-material";
import DownloadModal from "../Modal/DownloadModal";

const Urbanismo = ({ onBack, color, activeLayers, setActiveLayers }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = e => {
    e.stopPropagation();
    setShowModal(true);
  };
  // const [activeLayers, setActiveLayers] = useState([]);

  const { toggleLayer } = useContext(MapLayerContext);
  const mapaServicios =
    "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms?";

  const itemsUrbanismo = [
    {
      id: 1,
      nombre: "Parcelas",
      icono: <FaHouse />,
      layerProps: null,
      geoservicios: true,
    },
    {
      id: 2,
      nombre: "Manzanas",
      icono: <Settings />,
      layerProps: null,
    },
    {
      id: 3,
      nombre: "Secciones Catastrales",
      icono: <BsFillHousesFill />,
      layerProps: null,
    },
    { id: 4, nombre: "Barrios", icono: <BsFillHousesFill />, layerProps: null },
    { id: 5, nombre: "Comunas", icono: <BsFillHousesFill />, layerProps: null },
    {
      id: 6,
      nombre: "Sedes Comunales",
      icono: <BsFillHousesFill />,
      layerProps: null,
    },
    {
      id: 7,
      nombre: "Espacios Verdes",
      icono: <NaturePeople />,
      layerProps: {
        url: mapaServicios,
        layers: "evp",
        name: "evp",
        attribution: "&copy; attribution",
      },
    },
    {
      id: 8,
      nombre: "Código Urbanístico",
      icono: <LocationCity />,
      layerProps: null,
    },
    {
      id: 9,
      nombre: "Relevamiento de Usos del Suelo",
      icono: <GiPlantRoots />,
      layerProps: null,
    },
    {
      id: 10,
      nombre: "Radios Censales",
      icono: <RadioButtonChecked />,
      layerProps: null,
    },
    {
      id: 11,
      nombre: "Población por radio censal",
      icono: <SupervisedUserCircle />,
      layerProps: null,
    },
    {
      id: 12,
      nombre: "Distritos Económicos ",
      icono: <AccountBalance />,
      layerProps: null,
    },
  ];

  const handleItemClick = (id, layerProps) => {
    setActiveLayers(prev =>
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
        className="d-flex m-0 p-2 justify-content-between align-items-center"
        style={{ backgroundColor: `${color}` }}
      >
        <div className="fs-4 text-light list-group-item">
          Urbanismo
          <div className="badge  fs-6  text-dark fw-bold  bg-white opacity-50 px-2 mx-3 ">
            {activeLayers.length ? `${activeLayers.length}` : null}
          </div>
        </div>
        <div></div>
        <button
          onClick={onBack}
          type="button"
          className="btn-close btn-close-white p-0 m-2"
          aria-label="Close"
        ></button>
      </div>
      <ul className="m-0 p-0">
        {itemsUrbanismo.map(item => {
          const isActive = activeLayers.includes(item.id);
          return (
            <li
              className={`d-flex gap-2 m-1 p-1 align-items-center  ${
                isActive ? "active" : ""
              }`}
              key={item.id}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={item.nombre}
              option={item.opciones}
              onClick={() => handleItemClick(item.id, item.layerProps)}
              style={{
                cursor: "pointer",
                backgroundColor: isActive ? "#f0f0f0" : "transparent",
              }}
            >
              <input type="checkbox" checked={isActive} readOnly />
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

export default Urbanismo;
