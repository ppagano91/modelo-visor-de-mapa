import React, { useState, useContext } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import axios from "axios";
import { parseString } from "xml2js";
import { AppContext } from "../context/AppContext";
import { FaInfoCircle } from "react-icons/fa";
import { PATHS } from "../utils/consts/paths";
import Alerts from "../components/Alerts/Alerts";
import { getEnv } from "../config";

const WMSMap = ({ showModal, handleCloseModal }) => {
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const { setSelectedLayers, openSection } = useContext(AppContext);

  const handleUrlChange = event => {
    setWmsUrl(event.target.value);
    setLayers([]);
    setError(false);
  };

  const handleCleanSearch = () => {
    setInput("");
    setWmsUrl([]);
  };

  const handleLoadClick = async () => {
    const fullUrl = `${wmsUrl}?request=GetCapabilities&service=WMS&version=1.3.0`;
    setLoading(true); // Iniciar el estado de carga
    try {
      const response = await axios.get(fullUrl);
      parseString(response.data, (err, result) => {
        if (err) {
          console.error("Error WMS capabilities:", err);
          setError(true);
          setLoading(false); // Terminar la carga
          return;
        }
        const layerList = extractLayers(result);
        setLayers(layerList);
        setError(false);
      });
    } catch (error) {
      console.error("Error fetching WMS capabilities:", error);
      setError(true);
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  const extractLayers = capabilities => {
    const layers = [];
    const layerElements =
      capabilities.WMS_Capabilities.Capability[0].Layer[0].Layer;
    for (const layerElement of layerElements) {
      layers.push({
        name: layerElement.Name[0] || layerElement.Title[0],
        url: wmsUrl,
        isActive: true,
      });
    }
    return layers;
  };

  const handleLayerSelect = layer => {
    setSelectedLayers(prevLayers => [...prevLayers, layer]);
    openSection(PATHS.temporalsLayers);
    handleCloseModal();
  };
  const handleFocus = e => {
    e.target.style.boxShadow = "0 0 0 0.2rem " + getEnv("VITE_COLOR_THIRD");
  };

  const handleBlur = e => {
    e.target.style.boxShadow = "none";
  };

  return (
    <Modal
      centered
      show={showModal}
      onHide={handleCloseModal}
      dialogClassName="padding-modal modal-l"
    >
      <Modal.Header className="p-2 fw-bolder px-3">
        <div className="d-flex justify-content-between align-items-center w-100 ">
          <Modal.Title className="h3 fw-bold mt-2 ">
            Capas Temporales
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-sm mt-1"
            aria-label="Close"
            onClick={handleCloseModal}
          ></button>
        </div>
      </Modal.Header>
      <Modal.Body className="ps-2 pe-2 flex">
        <form className="d-flex" role="search">
          <div className="input-group ">
            <label for="search" className="form-label  mt-3">
              Ingresa URL del servicio WMS
            </label>
            <div className="search-container d-flex align-items-center w-100 ">
              <input
                type="search"
                value={wmsUrl}
                onChange={handleUrlChange}
                placeholder="http://tu-servidor.com/geoserver/wms"
                className="form-control input-search input-search-with-button w-100"
                id="search-btn"
                style={{
                  fontFamily: "Open Sans",
                  width: "25rem",
                  height: "2.75rem",
                  backgroundColor: getEnv("VITE_COLOR_LIGHT"),
                  color: getEnv("VITE_COLOR_SECONDARY"),
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <button
                className="reset"
                type="reset"
                onClick={handleCleanSearch}
              ></button>
              <button
                class="button-search"
                type="submit"
                aria-label="Buscar"
                onClick={handleLoadClick}
                disabled={loading} // Deshabilitar botón mientras carga
              ></button>
            </div>
          </div>
        </form>

        {loading ? ( // Mostrar spinner si está cargando
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <p
              className="mt-2 layer-section-container fs-6 p-2 fw-bold "
              style={{
                color: getEnv("VITE_COLOR_SECONDARY"),
                fontFamily: "Open Sans",
                fontWeight: "600",
              }}
            >
              Cargando capas...
            </p>
            <div
              className="spinner-border text-dark align-self-center"
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
              }}
            ></div>
          </div>
        ) : (
          layers.length > 0 && (
            <Dropdown>
              <Dropdown.Toggle
                variant="dropdown"
                id="dropdown-basic"
                className="btn-dropdown-border mt-2"
              >
                <span
                  className="material-symbols-rounded o-icon"
                  aria-label="hidden"
                >
                  layers
                </span>
                <span className="btn-dropdown-text ellipsis-1">
                  Capas Disponibles
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {layers.map((layer, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleLayerSelect(layer)}
                  >
                    {layer.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )
        )}

        {error && (
          <div className="error-message mt-2 mx-auto ">
            <Alerts type="danger" message="La URL ingresada es incorrecta." />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="pb-2 pe-2"></Modal.Footer>
    </Modal>
  );
};

export default WMSMap;
