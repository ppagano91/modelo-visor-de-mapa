import React from "react";
import LOGO from "../assets/images/logo-bsas.png";
import { getEnv } from "../config";

const Navbar = () => {
  return (
    <nav
      className="navbar"
      style={{ height: "10vh", backgroundColor: getEnv("VITE_COLOR") }}
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
          <h3
            className="navbar-text mb-0 text-center fs-4 d-none d-md-block"
            style={{
              fontWeight: "bold",
            }}
          >
            Mapa de la Ciudad de Buenos Aires
          </h3>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
