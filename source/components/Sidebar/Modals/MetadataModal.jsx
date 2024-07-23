import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { AppContext } from "../../../context/AppContext";

const MetadataModal = () => {
  const { metadataModalShow, handleMetadataModalClose } =
    useContext(AppContext);
  return (
    <Modal
      show={metadataModalShow}
      onHide={handleMetadataModalClose}
      centered
      dialogClassName="modal-l"
    >
      <Modal.Header className="bg-warning p-2 fw-bolder px-3" closeButton>
        <Modal.Title className="h5 fw-bold">Metadata</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="fw-bold">
          Resumen:{" "}
          <span className="fw-normal">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos, quam.
          </span>
        </p>
        <p className="fw-bold">
          Contacto:{" "}
          <span className="fw-normal">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum sit
            provident minus doloremque voluptates quae maxime.
          </span>
        </p>
        <p>
          <a
            href={"#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <b>Metadato Completo</b>
          </a>
        </p>
      </Modal.Body>
    </Modal>
  );
};

export default MetadataModal;
