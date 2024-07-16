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
  const navigate = useNavigate();

  
  const handleActiveSection = (path) => {
    setActiveSection((prevState) => (prevState === path ? null : path));
  };

  const toggle = (path) => {
    handleActiveSection(path);
    setLastActiveSection(path);
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
    console.log(event);
    console.log(props);
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
        handleMetadataModal,
        handleMetadataModalClose
      }}
    >
      {children}
    </AppContext.Provider>
  );
};