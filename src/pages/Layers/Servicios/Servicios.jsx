import {
  FaBriefcase,
  FaBuilding,
  FaChurch,
  FaFireExtinguisher,
  FaFlag,
  FaGavel,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaShoppingCart,
  FaWifi,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import DownloadModal from "../Modal/DownloadModal";
import {
  CloudDownloadOutlined,
  InfoOutlined,
  PublicOutlined,
} from "@mui/icons-material";

const Servicios = ({
  onBack,
  color,
  activeServiciosLayers,
  setActiveServiciosLayers,
}) => {
  const mapaServicios =
    "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms?";
  const { toggleLayer } = useContext(MapLayerContext);
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = e => {
    e.stopPropagation();
    setShowModal(true);
  };
  const itemsServicios = [
    {
      id: 1,
      icono: <FaBuilding />,
      nombre: "Comisarías Policía de la Ciudad",
      layerProps: null,
    },
    {
      id: 2,
      icono: <FaShieldAlt />,
      nombre: "División Comisarías Vecinales",
      layerProps: {
        url: mapaServicios,
        layers: "area_vecinal",
        name: "area_vecinal",
        attribution: "&copy; attribution",
      },
    },
    {
      id: 3,
      icono: <FaFireExtinguisher />,
      nombre: "Estaciones de Bomberos",
      layerProps: null,
    },
    {
      id: 4,
      icono: <FaGavel />,
      nombre: "Fiscalías de la Ciudad",
      layerProps: null,
    },
    {
      id: 5,
      icono: <FaShoppingCart />,
      nombre: "Ferias Itinerantes de Abastecimiento Barrial",
      layerProps: null,
    },
    {
      id: 6,
      icono: <FaFlag />,
      nombre: "Embajadas y Consulados",
      layerProps: null,
    },
    {
      id: 7,
      icono: <FaWifi />,
      nombre: "WiFi Gratis",
      layerProps: null,
    },
    {
      id: 8,
      icono: <FaBriefcase />,
      nombre: "Centros de Integración Laboral",
      layerProps: null,
    },
    {
      id: 9,
      icono: <FaChurch />,
      nombre: "Arquidiócesis (sin establecimientos educativos)",
      layerProps: null,
    },
    {
      id: 10,
      icono: <FaMapMarkedAlt />,
      nombre: "Arquidiócesis zonas",
      layerProps: null,
    },
  ];

  const handleItemClick = (id, layerProps) => {
    setActiveServiciosLayers(prev =>
      prev.includes(id) ? prev.filter(layerId => layerId !== id) : [...prev, id]
    );
    if (layerProps !== null) {
      console.log(layerProps);
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
        <div className="fs-4 text-light">
          Servicios
          <span className="badge fw-lighter fs-6">
            ({activeServiciosLayers.length})
          </span>
        </div>

        <button
          onClick={onBack}
          type="button"
          className="btn-close btn-close-white p-0 m-2"
          aria-label="Close"
        ></button>
      </div>
      <ul className="m-0 p-0">
        {itemsServicios.map(item => {
          const isActive = activeServiciosLayers.includes(item.id);
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

export default Servicios;
