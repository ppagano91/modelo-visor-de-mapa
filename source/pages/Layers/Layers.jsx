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
import MetadataModal from "../../components/Sidebar/Modals/MetadataModal";
import GeoserviciosModal from "../../components/Sidebar/Modals/GeoserviciosModal";
import { findSectionDescription } from "../../utils/temp";
import { AppContext } from "../../context/AppContext";

const Layers = () => {
  const { handleHits, handleHits2 } = useContext(MapLayerContext);
  const { getComponentByName, activeSectionName, handleActiveSectionName } = useContext(AppContext);  
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setSearching(true);
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
          `${getEnv("VITE_ELASTICSEARCH_URL")}/services_map/_search`,
          query
        );

        // console.log(`${getEnv("VITE_ELASTICSEARCH_GEO")}/gn-records/_search/`)

        const gnRecords = await axios.post(
          `${getEnv("VITE_ELASTICSEARCH_URL")}/gn-records/_search/`,
          {
            "query": {
              "bool": {
                "must": [
                  {
                    "match": {
                      "tag.default": "VISOR"
                    }
                  }
                ]
              }
            }
          }
          // `${getEnv("VITE_ELASTICSEARCH_GEO")}/gn-records/_search/`
        );
        
        if (response.data && response.data.hits) {
          const hits = response.data.hits.hits;          
          handleHits(hits);

          const records = gnRecords.data.hits.hits;
          
          const elements = records?.map((doc)=>{

            const layerProps = doc._source.link.find(link => link.protocol === "OGC:WMS" && link.function === "information");            
            const metadata = doc._source.link.find(link => link.protocol === "WWW:LINK-1.0-http--link");

            
            return {
              id: doc._source.metadataIdentifier,
              name: doc._source.resourceTitleObject.default,
              description: doc._source.resourceAbstractObject.default,
              props: {
                url: layerProps.urlObject.default,
                name: layerProps.nameObject.default,
                description: layerProps.descriptionObject.default,
                attribution: ""
              },
              metadata: {
                url: metadata?.urlObject.default,
                name: metadata?.nameObject.default,
                description: metadata?.descriptionObject.default,
                attribution: ""
              },
              section: doc._source.groupPublished
            }
          })

          const groupedBySection = elements.reduce((acc, obj) => {
            const section = obj.section;
          
            if (!acc[section]) {
              acc[section] = {
                description: findSectionDescription(section),
                elements: []
              };
            }
          
            acc[section].elements.push(obj);
            return acc;
          }, {});

          console.log("groupedBySection:", groupedBySection);

          handleHits2(groupedBySection);

          const newSections = hits.flatMap(hit => {
            const source = hit._source;
            if (!source) return [];
            return Object.entries(source).map(([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.slice(1),
              description: value.description,
              propiedades: value.propiedades,
              component: getComponentByName(key, value),
              borderColor: getColorByName(key),
            }));
          });
          console.log("newSections:",newSections);
          setSections(newSections);
          handleActiveSectionName(null);
        } else {
          setSections([]);
          handleActiveSectionName(null);
        }
        setSearching(false);
      } catch (error) {
        console.error("Error fetching data from Elasticsearch:", error);
        setSections([]);
        handleActiveSectionName(null);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSectionClick = id => {
    handleActiveSectionName(activeSectionName === id ? null : id);
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
    <>
      <div className="layer-wrapper">
        <div className="m-1 d-flex align-items-center justify-content-center w-90 layer-search border-bottom py-1">
          <input
            type="text"
            className="w-100 py-1 form-control border-3 flex-4 mx-2 px-2"
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
          {filteredSections && filteredSections.length > 0 && (
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
          )}
          {searching && (
            <div className="text-center">
              <div className="spinner-border" role="status"></div>
              <span className="d-block layer-section-container fs-6 p-2">
                {" "}
                Buscando capas...
              </span>
            </div>
          )}
          {!searching && filteredSections.length === 0 && (
            <div className="text-center">
              <p className="d-block layer-section-container fs-6 p-2">
                No se encontraron resultados.
              </p>
            </div>
          )}
          {activeSectionName !== null && filteredSections[activeSectionName] && (
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
              {filteredSections[activeSectionName].component}
            </div>
          )}
        </div>
      </div>
      <MetadataModal />
      <GeoserviciosModal />
    </>
  );
};

export default Layers;
