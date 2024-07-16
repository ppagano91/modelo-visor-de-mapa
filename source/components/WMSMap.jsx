import React, { useState, useContext } from "react";
import { Modal, Button, Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";
import { parseString } from "xml2js";
import { AppContext } from "../context/AppContext";

const WMSMap = ({ showModal, handleCloseModal }) => {
  const [wmsUrl, setWmsUrl] = useState("");
  const [layers, setLayers] = useState([]);
  console.log(layers);
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
      });
    }
    return layers;
  };

  const handleLayerSelect = layer => {
    setSelectedLayers(prevLayers => [...prevLayers, layer]);
    handleCloseModal();
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Capas Temporales</Modal.Title>
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
            className=" mb-2"
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
