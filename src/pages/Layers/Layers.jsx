import { useState } from "react";

import "../../styles/layers.css";
import Urbanismo from "./Urbanismo/Urbanismo";
import Transporte from "./Transporte/Transporte";
import Salud from "./Salud/Salud";
import Servicios from "./Servicios/Servicios";

import GeoFIUBA from "./GeoFIUBA/GeoFIUBA";

const Layers = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeLayers, setActiveLayers] = useState([]);
  const [activeTransporteLayers, setActiveTransporteLayers] = useState([]);
  const [activeSaludLayers, setActiveSaludLayers] = useState([]);
  const [activeServiciosLayers, setActiveServiciosLayers] = useState([]);

  const layerSections = [
    {
      id: 1,
      name: "Urbanismo",
      borderColor: "#FF5733",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et ...",
      component: (
        <Urbanismo
          onBack={() => setActiveSection(null)}
          color={"#FF5733"}
          activeLayers={activeLayers}
          setActiveLayers={setActiveLayers}
        />
      ),
    },
    {
      id: 2,
      name: "Transporte",
      borderColor: "#0dcaf0",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et ...",
      component: (
        <Transporte
          onBack={() => setActiveSection(null)}
          color={"#33FF57"}
          activeTransporteLayers={activeTransporteLayers}
          setActiveTransporteLayers={setActiveTransporteLayers}
        />
      ),
    },
    {
      id: 3,
      name: "Salud",
      borderColor: "#3357FF",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et ...",
      component: (
        <Salud
          onBack={() => setActiveSection(null)}
          color={"#3357FF"}
          activeSaludLayers={activeSaludLayers}
          setActiveSaludLayers={setActiveSaludLayers}
        />
      ),
    },
    {
      id: 4,
      name: "Servicios",
      borderColor: "#FF33A1",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et ...",
      component: (
        <Servicios
          onBack={() => setActiveSection(null)}
          color={"#FF33A1"}
          activeServiciosLayers={activeServiciosLayers}
          setActiveServiciosLayers={setActiveServiciosLayers}
        />
      ),
    },
    {
      id: 5,
      name: "GeoFIUBA",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et ...",
      borderColor: "#A1FF33",
      component: (
        <GeoFIUBA
          onBack={() => setActiveSection(null)}
          color={"#A1FF33"}
          activeLayers={activeLayers}
          setActiveLayers={setActiveLayers}
        />
      ),
    },
    // { id: 5, name: "Servicios Sociales", borderColor: "#33FFA1" },
    // { id: 6, name: "Accesibilidad", borderColor: "#A133FF" },
    // { id: 7, name: "Educación", borderColor: "#FFA133" },
    // { id: 8, name: "Cultura", borderColor: "#A1FF33" },
    // { id: 9, name: "Deportes y Esparcimiento", borderColor: "#33A1FF" },
    // { id: 10, name: "Ambiente", borderColor: "#FF5733" },
    // { id: 11, name: "Turismo", borderColor: "#33FF57" },
    // { id: 12, name: "Diversidad", borderColor: "#3357FF" },
    // { id: 13, name: "Memoria BA", borderColor: "#FF33A1" },
    // { id: 14, name: "Imágenes y Fotografías", borderColor: "#33FFA1" },
    // { id: 15, name: "ARGOS", borderColor: "#A133FF" },
  ];

  const handleSectionClick = id => {
    setActiveSection(activeSection === id ? null : id); // Cierra si está abierto, abre si está cerrado
  };

  return (
    <div className="layer-wrapper">
      <div className="m-1 d-flex align-items-center justify-content-center ">
        <input
          type="text"
          className="w-100 p-2 form-control border-success flex-4"
          placeholder="Buscador de Capas"
        />
      </div>
      <div
        className="h-100 layer-container"
        style={{ width: "21rem", position: "relative" }}
      >
        <ul className="d-block layer-section-container">
          {layerSections.map(section => (
            <li
              className="fs-4 p-2 layer-section"
              style={{ borderLeft: `0.25rem solid ${section.borderColor}` }}
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
            >
              {section.name}
              <br />
              {section.description && (
                <span
                  className="text-secondary"
                  style={{
                    fontSize: "0.8rem",
                    // marginLeft: "0.5rem",
                    display: "block",
                  }}
                >
                  {section.description}
                </span>
              )}
            </li>
          ))}
        </ul>
        {activeSection && (
          <div
            className="section-content"
            style={{
              position: "absolute",
              top: 0,
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              overflow: "auto",
            }}
          >
            {
              layerSections.find(section => section.id === activeSection)
                .component
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Layers;
