import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState(null);
  const handleActiveSection = (path) => {
    setActiveSection(prevState => prevState === path ? null : path);
  }

  return (
    <AppContext.Provider value={{ activeSection, handleActiveSection }}>
      {children}
    </AppContext.Provider>
  );
};