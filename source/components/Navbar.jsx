import React from "react";
import LOGO from "../assets/images/logo-bsas.png";

const Navbar = () => {
  return (
    <nav
      className="navbar  "
      style={{ height: "10vh", backgroundColor: "#FDD306" }}
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
          <span className="navbar-text h4 mb-0 text-center fw-bold color">
            Mapa de la Ciudad de Buenos Aires
          </span>
        </div>

        {/* TODO: Agregar botón para redireccionar al Portal */}
      </div>
    </nav>
  );
};

export default Navbar;
