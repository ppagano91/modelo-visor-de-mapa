import { FaHospital, FaHospitalSymbol, FaHospitalUser } from "react-icons/fa";
import {
  MdHealthAndSafety,
  MdOutlineLocalPharmacy,
  MdOutlineHealthAndSafety,
} from "react-icons/md";
import { RiHospitalLine } from "react-icons/ri";
import { TbVaccine } from "react-icons/tb";
import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import {
  CloudDownloadOutlined,
  InfoOutlined,
  PublicOutlined,
} from "@mui/icons-material";
import DownloadModal from "../Modal/DownloadModal";
import axios from "axios";
import { getEnv } from "../../../config";

const Salud = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsSalud, setItemsSalud] = useState([]);
  const { toggleLayer, setActiveLayers, activeLayers } =
    useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${getEnv("VITE_ELATICSEARCH_URL")}/services_map/_search`,
          {
            query: {
              match_all: {},
            },
          },
          {
            auth: {
              username: getEnv("VITE_ELATICSEARCH_USERNAME"),
              password: getEnv("VITE_ELATICSEARCH_PASSWORD"),
            },
          }
        );
        console.log(response)

        if (response.data && response.data.hits) {
          const hits = response.data.hits.hits;

          const saludItems = hits
            .filter(hit => hit._source.salud)
            .flatMap(hit =>
              (hit._source.salud.propiedades || [])
                .filter(propiedad => propiedad !== null)
                .map(propiedad => ({
                  id: propiedad.layerProps
                    ? propiedad.layerProps.name
                    : `${hit._id}_${propiedad.id}`,
                  nombre: propiedad.name || "",
                  icono: renderIcon(propiedad.icon),
                  layerProps: propiedad.layerProps
                    ? propiedad.layerProps
                    : null,
                }))
            );

          setItemsSalud(saludItems);
        }
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  const renderIcon = iconName => {
    switch (iconName) {
      case "FaHospital":
        return <FaHospital />;
      case "MdHealthAndSafety":
        return <MdHealthAndSafety />;
      case "MdOutlineHealthAndSafety":
        return <MdOutlineHealthAndSafety />;
      case "RiHospitalLine":
        return <RiHospitalLine />;
      case "FaHospitalUser":
        return <FaHospitalUser />;
      case "MdOutlineLocalPharmacy":
        return <MdOutlineLocalPharmacy />;
      case "FaHospitalSymbol":
        return <FaHospitalSymbol />;
      case "TbVaccine":
        return <TbVaccine />;
      default:
        return null;
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = e => {
    e.stopPropagation();
    setShowModal(true);
  };

  const handleItemClick = (id, layerProps) => {

    if (layerProps !== null) {
      toggleLayer(layerProps);
    }

    // Siempre actualizamos activeLayers, independientemente de si hay layerProps o no
    setActiveLayers(prevActiveLayers => {
      if (prevActiveLayers.includes(id)) {
        return prevActiveLayers.filter(layerId => layerId !== id);
      } else {
        return [...prevActiveLayers, id];
      }
    });
  };

  return (
    <div>
      <DownloadModal show={showModal} handleClose={handleModalClose} />
      <div
        className="d-flex m-0 p-2 justify-content-between align-items-center"
        style={{ backgroundColor: `${color}` }}
      >
        <div className="fs-4 text-light">
          Salud
          <div className="badge  fs-6  text-dark fw-bold  bg-white opacity-50 px-2 mx-3 ">
            {activeLayers.length ? `${activeLayers.length}` : null}
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
        {itemsSalud.map(item => {
          const isActive = activeLayers.includes(item.id);
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

export default Salud;
