import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import {
  AlternateEmail,
  Info,
  Layers,
  LibraryBooks,
  Queue,
  School,
} from "@mui/icons-material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PATHS } from "../utils/consts/paths";

const Sidebar = ({ children }) => {
  const { activeSection, toggle, toggleLastSection, lastActiveSection } =
    useContext(AppContext);
  const widthComponent = 15;

  const menuItems = [
    {
      path: PATHS.masInformacion,
      name: "Más Información",
      icon: <Info />,
      width: widthComponent,
    },
    {
      path: PATHS.contacto,
      name: "Contacto",
      icon: <AlternateEmail />,
      width: widthComponent,
    },
    {
      path: PATHS.layers,
      name: "Layers",
      icon: <Layers />,
      width: widthComponent,
    },
    {
      path: PATHS.temporalsLayers,
      name: "Layers",
      icon: <Queue />,
      width: widthComponent,
    },
  ];

  const bottomMenuItems = [
    {
      path: PATHS.normativas,
      name: "Normativas",
      icon: <LibraryBooks />,
      width: widthComponent,
    },
    {
      path: PATHS.institucional,
      name: "Institucional",
      icon: <Info />,
      width: widthComponent,
    },
    {
      path: PATHS.tutorials,
      name: "Tutoriales",
      icon: <School />,
      width: widthComponent,
    },
  ];

  return (
    <div className="d-flex">
      <div
        className="bg-dark text-light sidebar d-flex flex-column align-items-center"
        style={{ width: "4rem" }}
      >
        <div className="d-flex flex-column flex-grow-1 w-100">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`d-flex align-items-center text-light gap-3 link p-3 ${
                activeSection === item.path ? "active" : ""
              }`}
              onClick={() => toggle(item.path)}
            >
              <div className="fs-5 icon">{item.icon}</div>
            </NavLink>
          ))}
          <div className="mt-auto">
            {bottomMenuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className={`d-flex align-items-center text-light gap-3 link p-3 ${
                  activeSection === item.path ? "active" : ""
                }`}
                onClick={() => toggle(item.path)}
              >
                <div className="fs-5 icon" title={item.name}>
                  {item.icon}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
        <div className="d-flex align-items-center w-100 p-2 justify-content-center">
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
