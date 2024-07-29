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
  Map    
} from "@mui/icons-material";
import DownloadModal from "../Modal/DownloadModal";
import { AppContext } from "../../../context/AppContext";

const Salud = ({ onBack, color }) => {
  const [showModal, setShowModal] = useState(false);
  const [itemsSalud, setItemsSalud] = useState([]);
  const [downloadProps, setDownloadProps] = useState(null);
  const { toggleLayer, setActiveLayers, activeLayers, hits } =
    useContext(MapLayerContext);
  const { handleMetadataModal, handleGeoserviciosModal } =
    useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      try {        
        const data = Object.keys(hits)
        .filter(key => key === 'salud')
        .reduce((obj, key) => {
          obj[key] = hits[key];
          return obj;
        }, {});
        const items = data.salud.elements.map(element => (
          element
        ))
        setItemsSalud(items);
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
              title={item.name}
              onClick={() => handleItemClick(item.id, item.props)}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => handleItemClick(item.id, item.props)}
              />
              {item.icono}
              <p className="m-0">{item.name}</p>
              <div className="d-flex gap-1 ms-auto">
                <PublicOutlined
                  style={{ height: "16px" }}
                  tooltip="Acceso a Geoservicios"
                  onClick={e => {
                    handleGeoserviciosModal(e, item.props);
                  }}
                />
                <InfoOutlined
                  style={{ height: "16px" }}
                  tooltip="Info"
                  onClick={e => {
                    handleMetadataModal(e, item.props);
                  }}
                />

                <CloudDownloadOutlined
                  style={{ height: "16px" }}
                  tooltip="Descargar Geoservicios"
                  onClick={e => handleModal(e, item.props)}
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
