import React, { useState, useContext } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
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
  const { setSelectedLayers, openSection } = useContext(AppContext);

  const handleUrlChange = (event) => {
    setWmsUrl(event.target.value);
    setLayers([]);
    setError(false);
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

  const extractLayers = (capabilities) => {
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

  const handleLayerSelect = (layer) => {
    setSelectedLayers((prevLayers) => [...prevLayers, layer]);
    openSection(PATHS.temporalsLayers);
    handleCloseModal();
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Ejemplo: http://tu-servidor.com/geoserver/wms
    </Tooltip>
  );

  return (
    <Modal centered show={showModal} onHide={handleCloseModal} className="modal-l"
    dialogClassName="wms-modal"
    >
      <Modal.Header
        className="p-2 px-3"
      >
        <div className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title className="h5 fw-bold">Capas Temporales</Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-sm"
            aria-label="Close"
            onClick={handleCloseModal}
          ></button>
        </div>
      </Modal.Header>
      <Modal.Body className="ps-2 pe-2">
        <div className="input-group mb-2">
          <input
            type="text"
            value={wmsUrl}
            onChange={handleUrlChange}
            placeholder="Ingresa URL del servicio WMS"
            className="form-control"
          />
          <OverlayTrigger placement="right" overlay={renderTooltip}>
            <span className="input-group-text">
              <FaInfoCircle />
            </span>
          </OverlayTrigger>
        </div>

        {loading ? ( // Mostrar spinner si está cargando
          <div className="text-center my-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          layers.length > 0 && (
            <DropdownButton
              className="mb-2"
              title="Capas Disponibles"
              menuVariant="dark"
              variant="dark"
            >
              {layers.map((layer, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleLayerSelect(layer)}
                >
                  {layer.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          )
        )}

        {error && (
          <div className="error-message">
            <Alerts type="danger" message="La URL ingresada es incorrecta" />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="pb-2 pe-2">
        <Button
          onClick={handleLoadClick}
          style={{
            backgroundColor: "#007BC7",
            borderColor: "#007BC7",
          }}
          disabled={loading} // Deshabilitar botón mientras carga
        >
          {loading ? "Cargando..." : "Cargar Capas"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WMSMap;
