import { createContext, useContext, useState, useEffect } from "react";
import { MapLayerContext } from "./MapLayerContext";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { info } = useContext(MapLayerContext);
  const [activeSection, setActiveSection] = useState(null);
  const [lastActiveSection, setLastActiveSection] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState([]);
  console.log(selectedLayers);
  const navigate = useNavigate();

  const handleActiveSection = path => {
    setActiveSection(prevState => (prevState === path ? null : path));
  };

  const toggle = path => {
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
    setActiveSection("/masinformacion");
    setLastActiveSection("/masinformacion");
    navigate("/masinformacion");
  };

  useEffect(() => {
    if (Object.keys(info).length > 0) {
      openMasInformacion();
    }
  }, [info]);

  return (
    <AppContext.Provider
      value={{
        activeSection,
        lastActiveSection,
        handleActiveSection,
        toggle,
        toggleLastSection,
        openMasInformacion,
        selectedLayers,
        setSelectedLayers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
