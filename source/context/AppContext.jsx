import { createContext, useState, useEffect } from "react";
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

  const setActiveSectionNameNull = () =>{
    setActiveSectionName(null);
  }



  const getComponentByName = (name, source) => {
    switch (name.toLowerCase()) {
      case "urbanismo":
        return (
          <Urbanismo
            color={"#FF5733"}
          />
        );
      case "transporte":
        return (
          <Transporte
            color={"#0dcaf0"}
          />
        );
      case "salud":
        return (
          <Salud
            color={"#3357FF"}
          />
        );
      case "servicios":
        return (
          <Servicios
            color={"#FF33A1"}
          />
        );
      case "otros":
        return (
          <Otros
            color={"#123456"}
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
        activeSectionName,
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
        handleActiveSectionName,
        setActiveSectionNameNull
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
