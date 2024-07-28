import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../utils/consts/paths";
import Urbanismo from "../pages/Layers/Urbanismo/Urbanismo";
import Transporte from "../pages/Layers/Transporte/Transporte";
import Salud from "../pages/Layers/Salud/Salud";
import Servicios from "../pages/Layers/Servicios/Servicios";
import Otros from "../pages/Layers/Otros/Otros";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [activeSectionName, setActiveSectionName] = useState(null);
  const [metadataModalShow, setMetadataModalShow] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [geoserviciosModalShow, setGeoserviciosModalShow] = useState(false);
  const [lastActiveSection, setLastActiveSection] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showTemporalLayers, setShowTemporalLayers] = useState(false);  

  const navigate = useNavigate();
  const location = useLocation();

  const handleActiveSection = path => {
    setActiveSection(prevState => (prevState === path ? null : path));
  };

  const addLayer = layer => {
    setSelectedLayers(prevLayers => [...prevLayers, layer]);
  };

  const toggle = path => {
    handleActiveSection(path);
    setLastActiveSection(path);
  };

  const toggleTemporalLayers = () => {
    setShowTemporalLayers(prevState => !prevState);
  };

  const toggleLastSection = () => {
    if (activeSection === lastActiveSection) {
      handleActiveSection(null);
    } else {
      handleActiveSection(lastActiveSection);
    }
  };

  useEffect(() => {
    if (selectedLayers.length > 0) {
      setShowTemporalLayers(true);
    } else {
      setShowTemporalLayers(false);
    }
  }, [selectedLayers]);

  const openSection = (page) => {
    setActiveSection(page);
    setLastActiveSection(page);
    navigate(page);
  };

  const handleMetadataModalClose = () => {
    setMetadataModalShow(false);
    setMetadata({});
  };

  const handleMetadataModal = (event, data) => {
    event.stopPropagation();
    setMetadataModalShow(true);
    setMetadata(prevState => data);
  };

  const handleGeoserviciosModalClose = () => setGeoserviciosModalShow(false);
  const handleGeoserviciosModal = (event, props) => {
    event.stopPropagation();
    setGeoserviciosModalShow(true);
  };

  const handleActiveSectionName = (sectionName) => {
    setActiveSectionName(prevState => sectionName);
  }



  const getComponentByName = (name, source) => {
    switch (name.toLowerCase()) {
      case "urbanismo":
        return (
          <Urbanismo
            onBack={() => setActiveSectionName(null)}
            color={"#FF5733"}
            activeLayers={source.propiedades}
            setActiveLayers={() => {}}
          />
        );
      case "transporte":
        return (
          <Transporte
            onBack={() => setActiveSectionName(null)}
            color={"#0dcaf0"}
            activeTransporteLayers={source.propiedades}
            setActiveTransporteLayers={() => {}}
          />
        );
      case "salud":
        return (
          <Salud
            onBack={() => setActiveSectionName(null)}
            color={"#3357FF"}
            activeSaludLayers={source.propiedades}
            setActiveSaludLayers={() => {}}
          />
        );
      case "servicios":
        return (
          <Servicios
            onBack={() => setActiveSectionName(null)}
            color={"#FF33A1"}
            activeServiciosLayers={source.propiedades}
            setActiveServiciosLayers={() => {}}
          />
        );
      case "otros":
        return (
          <Otros
            onBack={() => setActiveSectionName(null)}
            color={"#123456"}
            activeServiciosLayers={source.propiedades}
            setActiveServiciosLayers={() => {}}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveSection(currentPath);
    setLastActiveSection(currentPath);
  }, [location.pathname]);

  return (
    <AppContext.Provider
      value={{
        activeSection,
        lastActiveSection,
        metadata,
        metadataModalShow,
        geoserviciosModalShow,
        selectedLayers,
        showTemporalLayers,
        toggle,
        toggleLastSection,
        setSelectedLayers,
        toggleTemporalLayers,
        handleMetadataModal,
        handleMetadataModalClose,
        setShowTemporalLayers,
        openSection,
        addLayer,
        handleGeoserviciosModalClose,
        handleGeoserviciosModal,
        getComponentByName,
        activeSectionName,
        handleActiveSectionName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
