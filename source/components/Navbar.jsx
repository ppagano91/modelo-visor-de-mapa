import React from "react";
import LOGO from "../assets/images/logo-idecaba.png";
import { getEnv } from "../config";

const Navbar = () => {
  return (
    <nav
      className="navbar"
      style={{
        height: "10vh",
        backgroundColor: getEnv("VITE_COLOR_BLANCO"),
        borderBottom: ".25rem solid " + getEnv("VITE_COLOR_PRIMARY"),
      }}
    >
      <div className="container-fluid">
        <a className="navbar-brand" target="_blank" href={getEnv("VITE_IDECABA_URL")}>
          <img
            src={LOGO}
            alt="Logo"
            className="d-inline-block align-text-top"
          />
        </a>
        <div className="mx-auto">
          <h1
            className="navbar-text h3 mb-0 text-center "
            // fuente nunito bold
            style={{
              fontFamily: "Nunito",
              fontWeight: "bold",
              color: getEnv("VITE_COLOR_SECONDARY"),
            }}
          >
            Mapa de la Ciudad de Buenos Aires
          </h1>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
