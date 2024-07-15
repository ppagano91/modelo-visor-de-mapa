import React, { useState } from "react";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import { parseString } from "xml2js";

const WMSMap = ({
  showModal,
  handleCloseModal,
  handleLoadLayer,
  handleSelectLayer,
}) => {
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);

  const handleUrlChange = event => {
    setWmsUrl(event.target.value);
  };

  const handleLoadClick = async () => {
    const fullUrl = `${wmsUrl}?request=GetCapabilities`;
    console.log("Full URL:", fullUrl);
    try {
      const response = await axios.get(fullUrl);
      console.log("Response:", response.data);
      parseString(response.data, (err, result) => {
        if (err) {
          console.error("Error WMS capabilities:", err);
          return;
        }
        console.log("Parsed Capabilities:", result);
        const layerList = extractLayers(result);
        setLayers(layerList);
        console.log("Layers:", layerList);
        handleLoadLayer(fullUrl, layerList);
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
        name: layerElement.Name[0]
          ? layerElement.Name[0]
          : layerElement.Title[0],
      });
    }
    return layers;
  };

  const handleLayerSelect = layer => {
    handleSelectLayer(layer);
    handleCloseModal();
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Introduce la URL del servicio WMS</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          value={wmsUrl}
          onChange={handleUrlChange}
          placeholder="Ingresa URL del servicio WMS"
          className="form-control mb-2"
        />

        {layers.length > 0 && (
          <DropdownButton
            id="dropdown-basic-button"
            title="Capas Disponibles"
            className="w-100"
            menuVariant="dark"
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
        <Button variant="secondary" onClick={handleCloseModal}>
          Cerrar
        </Button>
        <Button variant="warning" onClick={handleLoadClick}>
          Cargar Capas
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WMSMap;
