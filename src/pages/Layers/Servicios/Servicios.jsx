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
import { useContext } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";

const Servicios = ({
  onBack,
  color,
  activeServiciosLayers,
  setActiveServiciosLayers,
}) => {
  const mapaServicios =
    "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms?";
  const { toggleLayer } = useContext(MapLayerContext);
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
    <div className="">
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

        <button onClick={onBack} className="btn btn-transparent">
          X
        </button>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Servicios;
