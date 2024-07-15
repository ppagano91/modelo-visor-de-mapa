import { FaRoad } from "react-icons/fa";
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
import { getEnv } from "../../../config";

const Transporte = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsTransporte, setItemsTransporte] = useState([]);
  const [downloadProps, setDownloadProps] = useState(null)
  const { toggleLayer, setActiveLayers, activeLayers, hits } =
  useContext(MapLayerContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const transporteItems = hits
            .filter(hit => hit._source.transporte)
            .flatMap(hit =>
              (hit._source.transporte.propiedades || [])
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
            
          setItemsTransporte(transporteItems);
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

  const handleModal = (e, layerProps) => {
    e.stopPropagation();

    if (layerProps){
      setDownloadProps(layerProps);
    } else{
      setDownloadProps(null);
    }
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
      {downloadProps && <DownloadModal show={showModal} handleClose={handleModalClose} downloadProps={downloadProps}/>}
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
                  onClick={(e) => {
                    handleModal(e, item.layerProps)}}
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
