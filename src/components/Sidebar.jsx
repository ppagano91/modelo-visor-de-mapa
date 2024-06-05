import { useState, useContext } from 'react'
import { FaBars, FaCommentAlt, FaRegChartBar, FaShoppingBag, FaTh, FaThList, FaUserAlt, FaRegStar, FaLayerGroup, FaStar, FaInfo, FaChevronLeft, FaChevronRight   } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { FaPerson, FaPersonWalking } from 'react-icons/fa6';

const Sidebar = ({ children }) => {
  const [lastActiveSection, setLastActiveSection] = useState(null);
  const { activeSection, handleActiveSection } = useContext(AppContext);

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
    const widthComponent = 15;

    const menuItems = [
      {
        path: "/comollego",
        name: "¿Cómo Llego?",
        icon: <FaPersonWalking />,
        width: widthComponent
      },
      {
        path: "/favoritos",
        name: "Favoritos",
        icon: <FaStar />,
        width: widthComponent
      },
      {
        path: "/masinformacion",
        name: "Más Información",
        icon: <FaInfo />,
        width: widthComponent
      },
      {
        path: "/contacto",
        name: "Contacto",
        icon: <FaUserAlt />,
        width: widthComponent
      },
      {
        path: "/layers",
        name: "Layers",
        icon: <FaLayerGroup />,
        width: widthComponent
      },
    ];

    
  
    return (
      <div className='d-flex'>
        <div className='bg-dark text-light sidebar d-flex flex-column align-items-center' style={{ width: "4rem" }}>
          <div className="d-flex flex-column flex-grow-1 w-100">
            {menuItems.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="d-flex align-items-center text-light gap-3 link"
                onClick={() => toggle(item.path)}
              >
                <div className="fs-5 icon">{item.icon}</div>
              </NavLink>
            ))}
          </div>
          <div className="d-flex align-items-center w-100 p-2 justify-content-center">
            <button onClick={toggleLastSection} className="btn btn-light">
              {activeSection === lastActiveSection ? <FaChevronLeft /> : <FaChevronRight />}
            </button>
          </div>
        </div>
        <main className='main'>
          {activeSection && children}
        </main>
      </div>
    );
  };
  
  export default Sidebar;