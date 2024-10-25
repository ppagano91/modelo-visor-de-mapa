import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const DownloadModal = ({ show, handleClose, downloadProps }) => {
  const [loading, setLoading] = useState(false); // Estado de carga

  const handleDownload = (format) => {

    setLoading(true); // Iniciar el estado de carga
    const wfsUrl = `${downloadProps.url.replace('/wms?', '/wfs')}`;
    const params = new URLSearchParams({
      service: 'WFS',
      version: '1.1.0',
      request: 'GetFeature',
      typename: downloadProps.name,
      outputFormat: format === 'shp' ? 'SHAPE-ZIP' : `application/${format}`
    });

    fetch(`${wfsUrl}?${params.toString()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al exportar los datos en formato ${format}`);
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${downloadProps.name}.${format === 'json' ? 'json' : format === 'shp' ? 'zip' : 'kml'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(error => {
        console.error("Error al descargar la información de la capa:", error);
      })
      .finally(() => {
        setLoading(false); // Finalizar el estado de carga
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      dialogClassName="modal-sm"
    >
      <Modal.Header className="fw-bolder pb-2" >
        <div className="d-flex justify-content-between align-items-center w-100"> 
        <Modal.Title className="h5 fw-bold">
          Descargas
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
        </div>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-start">
        {loading ? ( // Mostrar spinner si está cargando
          <div className="spinner-border text-primary spinner-border-lg d-flex align-items-center m-auto" role="status">
            <span class="sr-only">Preparando archivo...</span>
          </div>
        ) : (
          <>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex flex-column gap-2">
                <span className="fw-bold" style={{fontFamily:"Nunito"}}>KML</span>
                <a
                  class="btn btn-secondary btn-sm download-link"
                  onClick={() => handleDownload('vnd.google-earth.kml+xml')}
                  disabled={loading}
                  style={{fontFamily:"Nunito", fontWeight: "bold", backgroundColor:"#101e37", fontSize:"18px", height:"32px", border:"none", borderRadius:"8px"}}
                >
                  Descargar
                </a>
              </div>
              <div className="d-flex flex-column gap-2">
                <span className="fw-bold" style={{fontFamily:"Nunito"}}>SHP</span>
                <a
                  class="btn btn-secondary btn-sm download-link"
                  onClick={() => handleDownload('shp')}
                  disabled={loading}
                  style={{fontFamily:"Nunito", fontWeight: "bold", backgroundColor:"#101e37", fontSize:"18px", height:"32px", border:"none", borderRadius:"8px"}}
                >
                  Descargar
                </a>
              </div>
              <div className="d-flex flex-column gap-2">
                <span className="fw-bold" style={{fontFamily:"Nunito"}}>JSON</span>
                <a
                  class="btn btn-secondary btn-sm download-link"
                  onClick={() => handleDownload('json')}
                  disabled={loading}
                  style={{fontFamily:"Nunito", fontWeight: "bold", backgroundColor:"#101e37", fontSize:"18px", height:"32px", border:"none", borderRadius:"8px"}}
                >
                  Descargar
                </a>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DownloadModal;
