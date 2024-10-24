import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../../context/AppContext";
import {
  CheckCircleOutlineSharp,
  ContentCopy,
  CheckCircle,
} from "@mui/icons-material";

const GeoserviciosModal = () => {
  const { geoserviciosModalShow, handleGeoserviciosModalClose, metadata } =
    useContext(AppContext);
  const [copiedStates, setCopiedStates] = useState({
    wms: false,
    wfs: false,
    layerName: false,
  });

  const checkClipboardPermissions = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-write' });
      if (result.state === 'granted' || result.state === 'prompt') {
        console.log("PERMISO OTORGADO")
        return true; // El permiso está concedido o se puede solicitar.
      } else {
        console.error("Permiso denegado para escribir en el portapapeles.");
        return false;
      }
    } catch (error) {
      console.error("Error al verificar permisos del portapapeles: ", error);
      return false;
    }
  };

  const copyToClipboard = async (text, key) => {

    const hasPermission = await checkClipboardPermissions();
    if (!hasPermission) {
    // alert("No se tiene permiso para acceder al portapapeles.");
    return;
  }

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

  // RENDER COPY ICON ORIGINAL

  // const renderCopyIcon = key => {
  //   return copiedStates[key] ? (
  //     <CheckCircle className="text-success mx-4" titleAccess="Copiado" />
  //   ) : (
  //     <ContentCopy
  //       className="text-secondary mx-4"
  //       titleAccess="Copiar"
  //       onClick={() => copyToClipboard(getTextToCopy(key), key)}
  //       style={{ cursor: "pointer" }}
  //     />
  //   );
  // };

  const renderCopyIcon = key => {
    return(
      <span
        className="material-symbols-outlined"
        title="Copiar"
        style={{ cursor: "pointer", marginLeft: "24px"}}
        onClick={() => copyToClipboard(getTextToCopy(key), key)}
      >
        content_copy
      </span>
    );
  };


  const getTextToCopy = key => {
    switch (key) {
      case "wms":
        return "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms";
      case "wfs":
        return "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wfs";
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
      dialogClassName="modal-l padding-modal"
      size="lg"
    >
      <Modal.Header className="p-2 fw-bolder px-3">
        <div className="d-flex justify-content-between align-items-center w-100"> 
        <Modal.Title className="h5 fw-bold">
          Geoservicios
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleGeoserviciosModalClose}
        ></button>
        </div>
      </Modal.Header>
      <Modal.Body className="ps-3 pb-2">
        <p className="fw-bold">
          WMS: <span className="fw-normal block">{getTextToCopy("wms")}</span>
          <span>{renderCopyIcon("wms")}</span>
        </p>
        <p className="fw-bold">
          WFS: <span className="fw-normal">{getTextToCopy("wfs")}</span>
          <span>{renderCopyIcon("wfs")}</span>
        </p>
        <p className="fw-bold">
          Nombre de Capa:{" "}
          <span className="fw-normal">{metadata.name && metadata.name.length > 0 ? (
            metadata.name
          ) : (
            "No hay información disponible."
          )}</span>
          <span>{renderCopyIcon("layerName")}</span>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default GeoserviciosModal;
