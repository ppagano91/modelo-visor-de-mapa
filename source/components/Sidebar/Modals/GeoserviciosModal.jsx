import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../../context/AppContext";
import {
  CheckCircleOutlineSharp,
  ContentCopy,
  CheckCircle,
} from "@mui/icons-material";

const GeoserviciosModal = () => {
  const { geoserviciosModalShow, handleGeoserviciosModalClose } =
    useContext(AppContext);
  const [copiedStates, setCopiedStates] = useState({
    wms: false,
    wfs: false,
    layerName: false,
  });

  const copyToClipboard = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      })
      .catch(err => {
        console.error("Error al copiar el texto: ", err);
      });
  };

  const renderCopyIcon = key => {
    return copiedStates[key] ? (
      <CheckCircle className="text-success mx-4" titleAccess="Copiado" />
    ) : (
      <ContentCopy
        className="text-secondary mx-4"
        titleAccess="Copiar"
        onClick={() => copyToClipboard(getTextToCopy(key), key)}
        style={{ cursor: "pointer" }}
      />
    );
  };

  const getTextToCopy = key => {
    switch (key) {
      case "wms":
        return "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms";
      case "wfs":
        return "https://mapa.educacion.gob.ar/geoserver/ows";
      case "layerName":
        return "Lorem, ipsum dolor sit amet consectetur adipisicing elit.";
      default:
        return "";
    }
  };

  return (
    <Modal
      show={geoserviciosModalShow}
      onHide={handleGeoserviciosModalClose}
      centered
      dialogClassName="modal-l"
      size="lg"
    >
      <Modal.Header className="bg-warning p-2 fw-bolder px-3" closeButton>
        <Modal.Title className="h5 fw-bold">Geoservicios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fw-bold">
          <CheckCircleOutlineSharp className="text-success p-1" />
          WMS:: <span className="fw-normal block">{getTextToCopy("wms")}</span>
          <span>{renderCopyIcon("wms")}</span>
        </p>
        <p className="fw-bold">
          <CheckCircleOutlineSharp className="text-success p-1" />
          WFS: <span className="fw-normal">{getTextToCopy("wfs")}</span>
          <span>{renderCopyIcon("wfs")}</span>
        </p>
        <p className="fw-bold">
          <CheckCircleOutlineSharp className="text-success p-1" />
          Nombre de Capa:{" "}
          <span className="fw-normal">{getTextToCopy("layerName")}</span>
          <span>{renderCopyIcon("layerName")}</span>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default GeoserviciosModal;
