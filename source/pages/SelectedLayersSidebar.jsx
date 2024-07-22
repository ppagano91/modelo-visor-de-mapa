import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import temporalLayerIcon from "../assets/images/layer-plus-regular-24.png";
import { Info } from "@mui/icons-material";

const SelectedLayersSidebar = () => {
  const { selectedLayers, setSelectedLayers } = useContext(AppContext);

  const [activeLayers, setActiveLayers] = useState([]);

  useEffect(() => {
    const initialLayersState = selectedLayers.map(layer => ({
      ...layer,
    }));
    setActiveLayers(initialLayersState);
  }, [selectedLayers]);

  const toggleActiveLayer = layerName => {
    setSelectedLayers(prevLayers => {
      const newLayers = prevLayers.map(layer =>
        layer.name === layerName
          ? { ...layer, isActive: !layer.isActive }
          : layer
      );
      return newLayers;
    });
  };

  const handleLayerClick = layerName => {
    toggleActiveLayer(layerName);
  };

  return (
    <div
      className="d-flex flex-column justify-content-start align-items-center"
      style={{ width: "21rem" }}
    >
      {selectedLayers.length > 0 ?
      <>
      <div
        className="w-100 text-center p-3"
        style={{ backgroundColor: "#007BC7" }}
      >
        <h5 className="m-0 text-light">Capas Temporales Seleccionadas</h5>
      </div>
      <div>
        <ul
          className="list-group p-0 rounded-1 my-2"
          style={{ width: "20rem" }}
        >
          
            {selectedLayers.map((layer, index) => (
              <li
                key={index}
                className={`d-flex   align-items-center list-group-item fw-bold list-item ${
                  layer.isActive
                    ? "list-group-item-warning"
                    : "list-group-item-light"
                }`}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={layer.isActive}
                  onChange={() => handleLayerClick(layer.name)}
                />
                {/* alinear a la izquierda */}

                <div className="text-truncate  justify-content-start px-2">
                  {layer.name}
                </div>
              </li>
            ))}
        </ul>
      </div>
      </>
      :
      <div className="d-flex flex-column justify-content-center align-items-center p-2 h-100" style={{ width: "21rem", position: "relative" }}>
          <Info className="m-2" />
        <p className="text-justify p-2">En esta sección se mostrarán las capas temporales. Para agregar una capa temporal debe utilizar la herramienta <img src={temporalLayerIcon} alt="Ícono de capas temporales" /> ubicada en la esquina superior derecha del mapa.</p>
      </div>
      }

    </div>
  );
};

export default SelectedLayersSidebar;
