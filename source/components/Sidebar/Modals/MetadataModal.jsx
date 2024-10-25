import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { AppContext } from "../../../context/AppContext";

const MetadataModal = () => {
  const { metadataModalShow, metadata, handleMetadataModalClose } =
    useContext(AppContext);
  return (
    <Modal
      show={metadataModalShow}
      onHide={handleMetadataModalClose}
      centered
      dialogClassName="modal-l"
    >
      <Modal.Header className="fw-bolder pb-2" >
        <div className="d-flex justify-content-between align-items-center w-100">
          <Modal.Title className="h5 fw-bold">
            {metadata.name || "Metadata"}
          </Modal.Title>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={handleMetadataModalClose}
          ></button>
        </div>
      </Modal.Header>
      <Modal.Body className="">
        <div className="d-flex pt-2">
          <span className="fw-bold">
            Resumen:{" "}
            <span className="fw-normal">
              {metadata.description || "No hay información disponible."}
            </span>
          </span>
        </div>
        <div className="d-flex pt-2">
          <span className="fw-bold">
            Contacto:{" "}
            <span className="fw-normal">{metadata.contact && metadata.contact.length > 0 ? (
              metadata.contact.map((item, index) => (
                <span key={index}>
                  {item.organisationObject.default}: <a onClick={(e) => window.location.href = `mailto:${item.email}`}>{item.email}</a>
                  {index < metadata.contact.length - 1 && "/ "}
                </span>
              ))
            ) : (
              "No hay información de contacto disponible."
            )}
            </span>
          </span>
        </div>
        <div className="d-flex pt-2">
          <p>
            <a class="external" href={metadata.url || "#"} target="_blank" rel="noopener noreferrer">Metadato Completo</a>
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MetadataModal;
