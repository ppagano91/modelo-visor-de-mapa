import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "../utils/consts/paths";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(null);
  const [metadataModalShow, setMetadataModalShow] = useState(false);
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

  const handleMetadataModalClose = () => setMetadataModalShow(false);

  const handleMetadataModal = (event, props) => {
    event.stopPropagation();
    setMetadataModalShow(true);
  };

  const handleGeoserviciosModalClose = () => setGeoserviciosModalShow(false);
  const handleGeoserviciosModal = (event, props) => {
    event.stopPropagation();
    setGeoserviciosModalShow(true);
  };

  const removeLayer = layerToRemove => {
    setSelectedLayers(selectedLayers.filter(layer => layer !== layerToRemove));
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
        metadataModalShow,
        toggle,
        toggleLastSection,
        selectedLayers,
        setSelectedLayers,
        showTemporalLayers,
        toggleTemporalLayers,
        handleMetadataModal,
        handleMetadataModalClose,
        setShowTemporalLayers,
        openSection,
        removeLayer,
        addLayer,
        handleGeoserviciosModalClose,
        handleGeoserviciosModal,
        geoserviciosModalShow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
