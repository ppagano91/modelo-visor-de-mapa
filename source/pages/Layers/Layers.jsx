import { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../../styles/layers.css";
import { Search } from "@mui/icons-material";
import { getEnv } from "../../config";
import { MapLayerContext } from "../../context/MapLayerContext";
import MetadataModal from "../../components/Sidebar/Modals/MetadataModal";
import GeoserviciosModal from "../../components/Sidebar/Modals/GeoserviciosModal";
import { findSectionDescription, getColorByName } from "../../utils/temp";
import { AppContext } from "../../context/AppContext";

const Layers = () => {
  const elasticsearchOptions = "transporte,servicios,salud,urbanismo,otros";
  const { handleHits } = useContext(MapLayerContext);
  const { getComponentByName, activeSectionName, handleActiveSectionName } =
    useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setSearching(true);
      try {
        const gnRecords = await axios.post(
          `${getEnv("VITE_ELASTICSEARCH_URL")}/gn-records/_search/`,
          // Esta Query debe ir a un Backend (API)
          {
            query: {
              bool: {
                must: [
                  {
                    match: {
                      "tag.default": "VISOR",
                    },
                  },
                ],
                //   "should": [
                //     {
                //         "match": {
                //             "resourceAbstractObject.default": searchTerm
                //         }
                //     },
                //     {
                //         "match": {
                //             "resourceTitleObject.default": searchTerm
                //         }
                //     }
                // ],
              },
            },
            size: 100,
          }
        );

        if (gnRecords.data && gnRecords.data.hits) {
          const records = gnRecords.data.hits.hits;

          const elements = records?.flatMap(doc => {
            const layerProps = Array.isArray(doc._source.link)
              ? doc._source.link.find(
                  link =>
                    link.protocol === "OGC:WMS" &&
                    link.function === "information"
                )
              : null;

            const metadata = Array.isArray(doc._source.link)
              ? doc._source.link.find(
                  link => link.protocol === "WWW:LINK-1.0-http--link"
                )
              : null;

            const groupPublished = Array.isArray(doc._source.groupPublished)
              ? doc._source.groupPublished
              : [doc._source.groupPublished];

            const groupPublishedId = Array.isArray(doc._source.groupPublishedId)
              ? doc._source.groupPublishedId
              : [doc._source.groupPublishedId];

            // Definimos las opciones a considerar
            const options = (
              getEnv("VITE_ELASTICSEARCH_OPCIONES") || elasticsearchOptions
            )
              .split(",")
              .map(option => option.trim().toLowerCase());

            // Mapeamos los elementos desglosados por opción que coincida
            return groupPublished.flatMap((section, index) => {
              if (options.includes(section)) {
                return {
                  sectionId: groupPublishedId[index],
                  id: doc._source.metadataIdentifier,
                  name: doc._source.resourceTitleObject.default,
                  description: doc._source.resourceAbstractObject.default,
                  props: layerProps
                    ? {
                        url: layerProps.urlObject?.default || "",
                        name: layerProps.nameObject?.default || "",
                        description:
                          layerProps.descriptionObject?.default || "",
                        attribution: "",
                      }
                    : {
                        url: "",
                        name: "",
                        description: "",
                        attribution: "",
                      },
                  metadata: metadata
                    ? {
                        url: metadata.urlObject?.default || "",
                        name: metadata.nameObject?.default || "",
                        description: metadata.descriptionObject?.default || "",
                        contact: doc._source.contact,
                        attribution: "",
                      }
                    : {
                        url: "",
                        name: "",
                        description: "",
                        contact: "",
                        attribution: "",
                      },
                  section: section,
                };
              } else {
                return [];
              }
            });
          });

          const groupedBySection = elements.reduce((acc, obj) => {
            const section = obj.section;

            if (!acc[section]) {
              acc[section] = {
                id: Number(obj.sectionId),
                description: findSectionDescription(section),
                elements: [],
              };
            }

            acc[section].elements.push(obj);
            return acc;
          }, {});

          handleHits(groupedBySection);

          const newSections = Object.entries(groupedBySection).map(
            ([key, value]) => ({
              name: key.charAt(0).toUpperCase() + key.substring(1),
              description: value.description,
              elements: value.elements || [],
              component: getComponentByName(key, value),
              borderColor: getColorByName(key),
            })
          );

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
  }, []);

  const handleSectionClick = id => {
    handleActiveSectionName(activeSectionName === id ? null : id);
  };

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  // Filtro para el buscador de capas. Esto se debería hacer desde Elasticsearch
  const filteredSections = sections
    .map(section => {
      const filteredItems = section.elements.filter(
        element =>
          (element.name &&
            element.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchTerm
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              )) ||
          (element.description &&
            element.description
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                searchTerm
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ))
      );

      const sectionMatches =
        (section.name &&
          section.name.toLowerCase().includes(
            searchTerm
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )) ||
        (section.description &&
          section.description.toLowerCase().includes(
            searchTerm
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          ));
      return { ...section, elements: filteredItems, sectionMatches };
    })
    .filter(
      section =>
        section.elements.length > 0 ||
        section.sectionMatches ||
        searchTerm.trim() === ""
    );

  filteredSections.sort((a, b) => {
    if (a.name.toLowerCase() === "Otros".toLowerCase()) return 1;
    if (b.name.toLowerCase() === "Otros".toLowerCase()) return -1;
    return a.name.localeCompare(a.name);
  });

  const handleFocus = e => {
    e.target.style.border = "none";
    e.target.style.boxShadow = "0 0 0 0.25rem " + getEnv("VITE_COLOR_THIRD");
  };
  const handleBlur = e => {
    e.target.style.boxShadow = "none";
  };
  const handleCleanSearch = () => {
    setSearchTerm("");
  };
  return (
    <>
      <div className="layer-wrapper">
        <form>
          <div class="search-container m-2">
            <input
              type="search"
              class="py-1  form-control input-search"
              id="search"
              placeholder="Buscador de Capas"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={{
                fontFamily: "Open Sans",
                height: "2.75rem",
                backgroundColor: "#F3F6F9",
                color: "black",
              }}
            />
            <button
              class="reset"
              type="reset"
              aria-label="Borrar"
              onClick={handleCleanSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></button>
          </div>
        </form>

        <div
          className="h-100 layer-container"
          style={{ width: "21rem", position: "relative" }}
        >
          {!searching && filteredSections && filteredSections.length > 0 && (
            <ul className="d-block layer-section-container">
              {filteredSections.map((section, index) => (
                <li
                  className="fs-4 p-2 layer-section"
                  style={{
                    borderLeft: `0.25rem solid ${section.borderColor}`,
                  }}
                  key={index}
                  onClick={() => handleSectionClick(index)}
                >
                  <h4
                    style={{
                      fontWeight: "bold",

                      color: "#101E37",
                    }}
                  >
                    {section.name}
                  </h4>

                  {section.description && (
                    <p
                      className=" m-0 p-0 text-normal"
                      style={{
                        fontSize: "0.8rem",
                        color: "#101E37",
                        display: "block",
                        textAlign: "justify",
                      }}
                    >
                      {section.description}
                    </p>
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
          {activeSectionName !== null &&
            filteredSections[activeSectionName] && (
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
