import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const DownloadModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-sm">
      <Modal.Header className="bg-warning p-2 fw-bolder px-3 ">
        <Modal.Title className="h5 fw-bold ">Descargas</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-sm"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-around ">
        <Button variant="warning fw-medium">SHP</Button>
        <Button variant="warning fw-medium">KML</Button>
        <Button variant="warning fw-medium">JSON</Button>
      </Modal.Body>
    </Modal>
  );
};

export default DownloadModal;
