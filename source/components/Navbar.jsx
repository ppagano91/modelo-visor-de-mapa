import React from "react";
import LOGO from "../assets/images/logo-bsas.png";
import { getEnv } from "../config";

const Navbar = () => {
  return (
    <nav
      className="navbar"
      style={{ height: "10vh", backgroundColor: getEnv("VITE_COLOR_AZUL") }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src={LOGO}
            alt="Logo"
            className="d-inline-block align-text-top"
          />
        </a>
        <div className="mx-auto">
          <span
            className="navbar-text h3 mb-0 text-center text-white"
            // fuente nunito bold
            style={{
              fontWeight: "bold",
              fontFamily: "Nunito",
            }}
          >
            Mapa de la Ciudad de Buenos Aires
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
