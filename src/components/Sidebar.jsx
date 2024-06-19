import { useState, useContext } from "react";
import {
  FaUserAlt,
  FaLayerGroup,
  FaInfo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { AlternateEmail, Info, Layers } from "@mui/icons-material";

const Sidebar = ({ children }) => {
  const [lastActiveSection, setLastActiveSection] = useState(null);
  const { activeSection, handleActiveSection } = useContext(AppContext);

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
  const widthComponent = 15;

  const menuItems = [
    {
      path: "/masinformacion",
      name: "Más Información",
      icon: <Info />,
      width: widthComponent,
    },
    {
      path: "/contacto",
      name: "Contacto",
      icon: <AlternateEmail />,
      width: widthComponent,
    },
    {
      path: "/layers",
      name: "Layers",
      icon: <Layers />,
      width: widthComponent,
    },
  ];

  return (
    <div className="d-flex">
      <div
        className="bg-dark text-light sidebar d-flex flex-column align-items-center "
        style={{ width: "4rem" }}
      >
        {/* que el hoover y el focus sean grises */}

        <div className="d-flex flex-column flex-grow-1 w-100 ">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="d-flex align-items-center text-light gap-3 link  p-3"
              onClick={() => toggle(item.path)}
            >
              <div className="fs-5 icon ">{item.icon}</div>
            </NavLink>
          ))}
        </div>
        <div className="d-flex align-items-center w-100 p-2 justify-content-center ">
          <button onClick={toggleLastSection} className="btn btn-dark">
            {activeSection === lastActiveSection ? (
              <FaChevronLeft />
            ) : (
              <FaChevronRight />
            )}
          </button>
        </div>
      </div>
      <main className="main">{activeSection && children}</main>
    </div>
  );
};

export default Sidebar;
