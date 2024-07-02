import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/layers.css";
import Urbanismo from "./Urbanismo/Urbanismo";
import Transporte from "./Transporte/Transporte";
import Salud from "./Salud/Salud";
import Servicios from "./Servicios/Servicios";
import { Search } from "@mui/icons-material";
import { getEnv } from "../../config";
import { MapLayerContext } from "../../context/MapLayerContext";

const Layers = () => {
  const {handleHits} = useContext(MapLayerContext);
  const [activeSection, setActiveSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = searchTerm
        ? {
            query: {
              multi_match: {
                query: searchTerm,
                fields: [
                  "urbanismo.propiedades.name",
                  "urbanismo.propiedades.description",
                  "transporte.propiedades.name",
                  "transporte.propiedades.description",
                  "salud.propiedades.name",
                  "salud.propiedades.description",
                  "servicios.propiedades.name",
                  "servicios.propiedades.description",
                ],
                fuzziness: "AUTO",
              },
            },
          }
        : {
            query: {
              match_all: {},
            },
          };
      try {
        const response = await axios.post(
          `${getEnv("VITE_ELATICSEARCH_URL")}/services_map/_search`,
          query,
          {
            auth: {
              username: getEnv("VITE_ELATICSEARCH_USERNAME"),
              password: getEnv("VITE_ELATICSEARCH_PASSWORD"),
            },
          }
        );
        console.log(response)

        if (response.data && response.data.hits) {
          const hits = await response.data.hits.hits;
          console.log(hits)
          handleHits(hits);
          

          const newSections = hits.flatMap(hit => {
            const source = hit._source;
            return Object.entries(source).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              description: value.description,
              propiedades: value.propiedades,
              component: getComponentByName(key, value),
              borderColor: getColorByName(key),
            }));
          });

          setSections(newSections);
        } else {
          setSections([]);
        }
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
        setSections([]);
      }
    };

    fetchData();
  }, [searchTerm]);

  const getComponentByName = (name, source) => {
    switch (name.toLowerCase()) {
      case "urbanismo":
        return (
          <Urbanismo
            onBack={() => setActiveSection(null)}
            color={"#FF5733"}
            activeLayers={source.propiedades}
            setActiveLayers={() => {}}
          />
        );
      case "transporte":
        return (
          <Transporte
            onBack={() => setActiveSection(null)}
            color={"#0dcaf0"}
            activeTransporteLayers={source.propiedades}
            setActiveTransporteLayers={() => {}}
          />
        );
      case "salud":
        return (
          <Salud
            onBack={() => setActiveSection(null)}
            color={"#3357FF"}
            activeSaludLayers={source.propiedades}
            setActiveSaludLayers={() => {}}
          />
        );
      case "servicios":
        return (
          <Servicios
            onBack={() => setActiveSection(null)}
            color={"#FF33A1"}
            activeServiciosLayers={source.propiedades}
            setActiveServiciosLayers={() => {}}
          />
        );
      default:
        return null;
    }
  };

  const handleSectionClick = id => {
    setActiveSection(activeSection === id ? null : id);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const getColorByName = name => {
    switch (name.toLowerCase()) {
      case "urbanismo":
        return "#FF5733";
      case "transporte":
        return "#0dcaf0";
      case "salud":
        return "#3357FF";
      case "servicios":
        return "#FF33A1";
      default:
        return "#000000";
    }
  };

  const filteredSections = sections
    .map(section => {
      const filteredItems = section.propiedades.filter(
        propiedad =>
          (propiedad.name &&
            propiedad.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (propiedad.description &&
            propiedad.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      return { ...section, propiedades: filteredItems };
    })
    .filter(
      section => section.propiedades.length > 0 || searchTerm.trim() === ""
    );

  return (
    <div className="layer-wrapper">
      <div className="m-1 d-flex align-items-center justify-content-center w-90 layer-search border-bottom py-1">
        <input
          type="text"
          className="w-100 py-1 form-control border-3 border-warning flex-4 mx-2 px-2"
          placeholder="Buscador de Capas"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-dark flex-1 mx-1 py-1">
          <Search />
        </button>
      </div>
      <div
        className="h-100 layer-container"
        style={{ width: "21rem", position: "relative" }}
      >
        <ul className="d-block layer-section-container">
          {filteredSections.map((section, index) => (
            <li
              className="fs-4 p-2 layer-section"
              style={{ borderLeft: `0.25rem solid ${section.borderColor}` }}
              key={index}
              onClick={() => handleSectionClick(index)}
            >
              {section.name}
              <br />
              {section.description && (
                <span
                  className="text-secondary"
                  style={{
                    fontSize: "0.8rem",
                    display: "block",
                  }}
                >
                  {section.description}
                </span>
              )}
            </li>
          ))}
        </ul>
        {activeSection !== null && (
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
            {filteredSections && filteredSections[activeSection].component}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layers;
