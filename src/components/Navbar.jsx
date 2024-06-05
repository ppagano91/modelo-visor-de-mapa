import React from 'react'
import LOGO from "../assets/images/logo-bsas.png"

const Navbar = () => {
  return (
    <nav className="navbar bg-warning" style={{height: "10vh"}}>
        <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src={LOGO} alt="Logo" className="d-inline-block align-text-top"/>
            </a>
            <form className="d-flex" role="search">
                <input className="form-control form-control-input-search me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-primary form-control-button-search" type="submit">🔍</button>
            </form>
        </div>
    </nav>
  )
}

export default Navbar