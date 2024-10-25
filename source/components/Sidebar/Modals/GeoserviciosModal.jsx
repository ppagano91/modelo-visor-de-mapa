import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../../context/AppContext";
import copy from "../../../assets/images/copy.png"
import { getEnv } from "../../../config";

const GeoserviciosModal = () => {
  const { geoserviciosModalShow, handleGeoserviciosModalClose, metadata } =
    useContext(AppContext);

  const [layerName, setLayerName] = useState("");
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

  const renderCopyIcon = key => {
    return copiedStates[key] ? (
      <span class="badge badge-success ms-3" style={{color:getEnv("VITE_COLOR_SECONDARY"), fontWeight:'normal', textTransform: 'none'}}>¡Copiado!</span>
    ) : (
      <img src={copy}
        className="text-secondary mx-4"
        titleAccess="Copiar"
        onClick={() => copyToClipboard(getTextToCopy(key), key)}
        style={{ cursor: "pointer" }}/>
    );
  };

  const getTextToCopy = key => {    
    switch (key) {
      case "wms":
        return "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wms";
      case "wfs":
        return "https://geoserver-dev.gcba.gob.ar/geoserver/IDECABA/wfs";
      case "layerName":
        return layerName;
      default:
        return "";
    }
  };
  useEffect(() => {
    setLayerName(metadata.name)
  }, [metadata])
  

  return (
    <Modal
      show={geoserviciosModalShow}
      onHide={handleGeoserviciosModalClose}
      centered
      dialogClassName="modal-l m-auto"
      size="lg"
    >
      <Modal.Header className="fw-bolder pb-2" >
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
      <Modal.Body className="">        
        <div className="d-flex pt-2">
              <span className="fw-bold">WMS:</span>
              <p className="fw-normal block ms-2 mb-0">
                {getTextToCopy("wms")}
              </p>
              <span>{renderCopyIcon("wms")}</span>
        </div>
        <div className="d-flex pt-2">
          <span className="fw-bold">WFS:</span>
              <p className="fw-normal block ms-2 mb-0">
                {getTextToCopy("wfs")}
              </p>
              <span>{renderCopyIcon("wfs")}</span>
          </div>

          <div className="d-flex pt-2">
            <span className="fw-bold">Nombre de Capa:{" "}</span>
              
            <p className="fw-normal block ms-2 mb-0">{metadata.name && metadata.name.length > 0 ? (
                metadata.name
              ) : (
                "No hay información disponible."
              )}</p>
              <span>{renderCopyIcon("layerName")}</span>
          </div>
      </Modal.Body>
    </Modal>
  );
};

export default GeoserviciosModal;
