import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../context/AppContext";

const SelectedLayersSidebar = () => {
  const { selectedLayers, removeLayer } = useContext(AppContext);

  return (
    <div
      className="d-flex flex-column justify-content-start align-items-center  "
      style={{ width: "21rem" }}
    >
      <div
        className="w-100 text-center p-3  "
        style={{ backgroundColor: "#007BC7" }}
      >
        <h5 className="m-0 text-light">Capas Temporales Seleccionadas</h5>
      </div>
      <div>
        <ul
          className="list-group   p-0 rounded-1 my-2  "
          style={{ width: "20rem" }}
        >
          {selectedLayers &&
            selectedLayers.length > 0 &&
            (console.log(selectedLayers),
            selectedLayers.slice().map(
              (layer, index) => (
                console.log(layer.name),
                (
                  <li
                    key={index}
                    className="d-flex justify-content-between align-items-center list-group-item fw-bold list-item list-group-item-light "
                  >
                    <div className="text-truncate    ">{layer.name}</div>

                    <Button
                      onClick={() => removeLayer(layer)}
                      type="button"
                      className="btn-close btn-close-warning p-1 m-2 bg-transparent border-0 btn-sm"
                      aria-label="Close"
                    ></Button>
                  </li>
                )
              )
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectedLayersSidebar;
