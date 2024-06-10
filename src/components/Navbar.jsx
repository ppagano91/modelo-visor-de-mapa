import React from 'react'
import LOGO from "../assets/images/logo-bsas.png"

const Navbar = () => {
  return (
    <nav className="navbar bg-warning" style={{height: "10vh"}}>
        <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src={LOGO} alt="Logo" className="d-inline-block align-text-top"/>
            </a>

            {/* TODO: Agregar botón para redireccionar al Portal */}
        </div>
    </nav>
  )
}

export default Navbar