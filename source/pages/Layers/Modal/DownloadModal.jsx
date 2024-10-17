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
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-sm">
      <Modal.Header className="bg-warning p-2 fw-bolder px-3">
        <Modal.Title className="h5 fw-bold">Descargas</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-sm"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-around">
        {loading ? ( // Mostrar spinner si está cargando
          <Spinner animation="border" role="status" className="m-auto">
            <span className="visually-hidden">Preparando archivo...</span>
          </Spinner>
        ) : (
          <>
            <Button
              variant="warning fw-medium"
              onClick={() => handleDownload('vnd.google-earth.kml+xml')}
              disabled={loading} // Deshabilitar botones mientras se descarga
            >
              KML
            </Button>
            <Button
              variant="warning fw-medium"
              onClick={() => handleDownload('shp')}
              disabled={loading}
            >
              SHP
            </Button>
            <Button
              variant="warning fw-medium"
              onClick={() => handleDownload('json')}
              disabled={loading}
            >
              JSON
            </Button>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DownloadModal;
