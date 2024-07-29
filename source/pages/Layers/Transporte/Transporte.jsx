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
  Map,
  PublicOutlined,
  Subway,
  Train,
} from "@mui/icons-material";
import { BiSolidTrafficBarrier } from "react-icons/bi";
import "../../../styles/Layers/Transporte/transporte.css";
import { useContext, useState, useEffect } from "react";
import { MapLayerContext } from "../../../context/MapLayerContext";
import DownloadModal from "../Modal/DownloadModal";
import { AppContext } from "../../../context/AppContext";

const Transporte = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsTransporte, setItemsTransporte] = useState([]);
  const [downloadProps, setDownloadProps] = useState(null);
  const { toggleLayer, setActiveLayers, activeLayers, hits } =
    useContext(MapLayerContext);
  const { handleMetadataModal, handleGeoserviciosModal } =
    useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const data = Object.keys(hits)
        .filter(key => key === 'transporte')
        .reduce((obj, key) => {
          obj[key] = hits[key];
          return obj;
        }, {});
        
        const items = data.transporte.elements.map(element => (
          element
        ))
        // console.log(items)
          // console.log(transporteItems)
        setItemsTransporte(items);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
      }
    };

    fetchData();
  }, []);

  const handleModalClose = () => setShowModal(false);

  const handleModal = (e, layerProps) => {
    e.stopPropagation();

    if (layerProps) {
      setDownloadProps(layerProps);
    } else {
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
      {downloadProps && (
        <DownloadModal
          show={showModal}
          handleClose={handleModalClose}
          downloadProps={downloadProps}
        />
      )}
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
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center list-item"
              style={{ position: "relative" }}
            >
              <li
                className="d-flex align-items-center flex-grow-1 gap-2 m-1 p-1 list-item"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={item.name}
                onClick={() => handleItemClick(item.id, item.props)}
                style={{
                  cursor: "pointer",
                  backgroundColor: isActive ? "#f0f0f0" : "transparent",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <input type="checkbox" checked={isActive} readOnly />
                {/* {item.icono} */}
                <p className="m-0 flex-grow-1">{item.name}</p>
              </li>
              <div className="d-flex gap-1 ms-auto">
                <PublicOutlined
                  style={{ height: "1rem" }}
                  tooltip="Acceso a Geoservicios"
                  onClick={e => {
                    handleGeoserviciosModal(e, item.props);
                  }}
                />
                <InfoOutlined
                  style={{ height: "1rem" }}
                  tooltip="Info"
                  onClick={e => {
                    handleMetadataModal(e, item.metadata);
                  }}
                />
                <CloudDownloadOutlined
                  style={{ height: "1rem" }}
                  tooltip="Descargar Geoservicios"
                  onClick={e => {
                    handleModal(e, item.props);
                  }}
                />
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Transporte;
