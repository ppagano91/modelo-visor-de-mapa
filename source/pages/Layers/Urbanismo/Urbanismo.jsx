import { FaHouse } from "react-icons/fa6";
import { BsFillHousesFill } from "react-icons/bs";
import { GiPlantRoots } from "react-icons/gi";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { getEnv } from "../../../config";

const Urbanismo = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsUrbanismo, setItemsUrbanismo] = useState([]);
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

        if (response.data && response.data.hits) {
          const hits = response.data.hits.hits;

          const urbanismoItems = hits
            .filter(hit => hit._source.urbanismo)
            .flatMap(hit =>
              hit._source.urbanismo.propiedades.map(propiedad => ({
                id: `${hit._id}_${propiedad.id}`,
                nombre: propiedad.name || "",
                icono: renderIcon(propiedad.icon),
                layerProps: propiedad.layerProps || null,
              }))
            );

          setItemsUrbanismo(urbanismoItems);
        }
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  const renderIcon = iconName => {
    switch (iconName) {
      case "FaHouse":
        return <FaHouse />;
      case "Settings":
        return <Settings />;
      case "BsFillHousesFill":
        return <BsFillHousesFill />;
      case "GiPlantRoots":
        return <GiPlantRoots />;
      case "NaturePeople":
        return <NaturePeople />;
      case "LocationCity":
        return <LocationCity />;
      case "RadioButtonChecked":
        return <RadioButtonChecked />;
      case "SupervisedUserCircle":
        return <SupervisedUserCircle />;
      case "AccountBalance":
        return <AccountBalance />;
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

    // Actualizar el estado de activeLayers
    setActiveLayers(prevActiveLayers => {
      if (prevActiveLayers.includes(id)) {
        return prevActiveLayers.filter(layerId => layerId !== id);
      } else {
        return [...prevActiveLayers, id];
      }
    });

    // Activar o desactivar la capa en el mapa
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
          <div className="badge fs-6 text-dark fw-bold bg-white opacity-50 px-2 mx-3">
            {activeLayers && activeLayers.length
              ? `${activeLayers.length}`
              : null}
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
          const isActive = activeLayers && activeLayers.includes(item.id);
          return (
            <li
              className="d-flex gap-2 m-1 p-1 align-items-center list-item"
              key={item.id}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={item.nombre}
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
                  onClick={handleModalShow}
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
