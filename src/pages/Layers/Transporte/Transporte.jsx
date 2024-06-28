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
import { BiSolidTrafficBarrier } from "react-icons/bi";
import "../../../styles/Layers/Transporte/transporte.css";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { MapLayerContext } from "../../../context/MapLayerContext";
import DownloadModal from "../Modal/DownloadModal";

const Transporte = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsTransporte, setItemsTransporte] = useState([]);
  const { toggleLayer, setActiveLayers, activeLayers } =
    useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://localhost:9200/services_map/_search",
          {
            query: {
              match_all: {},
            },
          },
          {
            auth: {
              username: "elastic",
              password: "jmoyano",
            },
          }
        );

        if (response.data && response.data.hits) {
          const hits = response.data.hits.hits;
          console.log("Hits received from Elasticsearch:", hits);

          const transporteItems = hits
            .filter(hit => hit._source.transporte)
            .flatMap(hit =>
              (hit._source.transporte.propiedades || [])
                .filter(propiedad => propiedad !== null)
                .map(propiedad => ({
                  id: `${hit._id}_${propiedad.id}`,
                  nombre: propiedad.name || "",
                  layerUrl: propiedad.layerProps
                    ? propiedad.layerProps.url
                    : null,
                  icono: renderIcon(propiedad.icon),
                  layerProps: propiedad.layerProps
                    ? propiedad.layerProps.name
                    : null,
                }))
            );

          setItemsTransporte(transporteItems);
          console.log("transporteItems", transporteItems);
        } else {
          console.log("No hits received from Elasticsearch");
        }
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  const renderIcon = iconName => {
    switch (iconName) {
      case "FaRoad":
        return <FaRoad />;
      case "FaTrain":
        return <FaTrain />;
      case "FaSubway":
        return <FaSubway />;
      case "FaTram":
        return <FaTram />;
      case "FaBus":
        return <FaBus />;
      case "FaBusAlt":
        return <FaBusAlt />;
      case "FaTaxi":
        return <FaTaxi />;
      case "FaParking":
        return <FaParking />;
      case "DirectionsBike":
        return <DirectionsBike />;
      case "ElectricBike":
        return <ElectricBike />;
      case "DirectionsTransit":
        return <DirectionsTransit />;
      case "DirectionsBus":
        return <DirectionsBus />;
      case "LocalTaxi":
        return <LocalTaxi />;
      case "LocalParking":
        return <LocalParking />;
      case "BiSolidTrafficBarrier":
        return <BiSolidTrafficBarrier />;
      case "Subway":
        return <Subway />;
      case "Train":
        return <Train />;
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
    console.log("layerUrl", layerUrl);
    setActiveLayers(prevActiveLayers => {
      const updatedLayers = prevActiveLayers || [];
      if (updatedLayers.includes(id)) {
        return updatedLayers.filter(layerId => layerId !== id);
      } else {
        return [...updatedLayers, id];
      }
    });

    if (layerProps) {
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
          Transporte
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
        {itemsTransporte.map(item => {
          const isActive = activeLayers && activeLayers.includes(item.id);
          return (
            <li
              className="d-flex gap-2 m-1 p-1 align-items-center list-item"
              key={item.id}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={item.nombre}
              onClick={() =>
                handleItemClick(item.id, item.layerProps, item.layerUrl)
              }
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

export default Transporte;
