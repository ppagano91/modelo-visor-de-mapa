import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const SelectedLayersSidebar = ({
  selectedLayers,
  removeLayer,
  setSelectedLayers,
}) => {
  return (
    <div
      className="d-flex flex-column m-0 justify-content-start align-items-center bg-light rounded-2"
      style={{
        width: "21rem",
        position: "absolute",
        left: 0,
        top: "10rem",
        zIndex: 1000,
      }}
    >
      <div className="w-100 bg-warning text-center fw-bold p-3 rounded-top-2">
        <h5 className="m-0">Capas Seleccionadas</h5>
      </div>
      <ul className="list-group list-group-flush w-100 rounded-2 my-2 ">
        {selectedLayers
          .slice()
          .reverse()
          .map((layer, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center list-group-item fw-bold list-item list-group-item-light mx-2"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <div className="text-truncate w-100">{layer.name}</div>
              <Button
                onClick={() => removeLayer(layer)}
                type="button"
                className="btn-close btn-close-warning p-1 m-1 bg-transparent border-0"
                aria-label="Close"
              ></Button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SelectedLayersSidebar;
