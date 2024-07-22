import React, { useState, useContext } from "react";
import {
  Modal,
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { parseString } from "xml2js";
import { AppContext } from "../context/AppContext";
import { FaInfoCircle } from "react-icons/fa";

const WMSMap = ({ showModal, handleCloseModal }) => {
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const { setSelectedLayers } = useContext(AppContext);

  const handleUrlChange = event => {
    setWmsUrl(event.target.value);
  };

  const handleLoadClick = async () => {
    const fullUrl = `${wmsUrl}?request=GetCapabilities&service=WMS&version=1.3.0`;
    try {
      const response = await axios.get(fullUrl);
      parseString(response.data, (err, result) => {
        if (err) {
          console.error("Error WMS capabilities:", err);
          return;
        }
        const layerList = extractLayers(result);
        setLayers(layerList);
      });
    } catch (error) {
      console.error("Error fetching WMS capabilities:", error);
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
    handleCloseModal();
  };

  const renderTooltip = props => (
    <Tooltip id="button-tooltip " {...props}>
      Ejemplo: http://tu-servidor.com/geoserver/wms
    </Tooltip>
  );

  return (
    <Modal show={showModal} onHide={handleCloseModal} className="mx-4 my-5">
      <Modal.Header
        className=" p-2 px-3"
        style={{ backgroundColor: "#FDD306" }}
      >
        <Modal.Title className="h5 fw-medium">Capas Temporales</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-sm"
          aria-label="Close"
          onClick={handleCloseModal}
        ></button>
      </Modal.Header>
      <Modal.Body>
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
        {layers.length > 0 && (
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
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleLoadClick}
          style={{
            backgroundColor: "#007BC7",
            borderColor: "#007BC7",
            hover: "FDD306",
          }}
        >
          Cargar Capas
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WMSMap;
