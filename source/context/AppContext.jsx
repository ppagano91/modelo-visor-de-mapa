import { createContext, useContext, useState, useEffect } from 'react';
import { MapLayerContext } from './MapLayerContext';
import { useNavigate } from 'react-router-dom';
import {PATHS} from "../utils/consts/paths"

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { info } = useContext(MapLayerContext);
  const [activeSection, setActiveSection] = useState(null);
  const [metadataModalShow, setMetadataModalShow] = useState(false)
  const [metadata, setMetadata] = useState(null);
  const [lastActiveSection, setLastActiveSection] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [showTemporalLayers, setShowTemporalLayers] = useState(false);

  const navigate = useNavigate();

  
  const handleActiveSection = (path) => {
    setActiveSection((prevState) => (prevState === path ? null : path));
  };

  const toggle = path => {
    handleActiveSection(path);
    setLastActiveSection(path);
  };
  const toogleTemporalLayers = () => {
    setShowTemporalLayers(prev => !prev);
  };

  const toggleLastSection = () => {
    if (activeSection === lastActiveSection) {
      handleActiveSection(null);
    } else {
      handleActiveSection(lastActiveSection);
    }
  };

  const openMasInformacion = () => {
    setActiveSection(PATHS.masInformacion);
    setLastActiveSection(PATHS.masInformacion);
    navigate(PATHS.masInformacion);
  };

  useEffect(() => {
    if (Object.keys(info).length > 0) {
      openMasInformacion();
    }
  }, [info]);
  
  const handleMetadataModalClose = () => setMetadataModalShow(false);

  const handleMetadataModal = (event, props) => {
    setMetadataModalShow(true);
  }

  return (
    <AppContext.Provider
      value={{ activeSection,
        lastActiveSection,
        metadataModalShow,
        handleActiveSection,
        toggle,
        toggleLastSection,
        openMasInformacion,
        selectedLayers,
        setSelectedLayers,
        showTemporalLayers,
        toogleTemporalLayers,
        handleMetadataModal,
        handleMetadataModalClose
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
