import React from "react";
import { NavLink, Link } from "react-router-dom";
import "./NavBar.css"

const NavBar = () => {
    return (
      <>
      <nav className="Nav">
        <div className="Nav__container">
        <a href="/" className="Nav__brand">
          <img src="logo.svg" className="Nav__logo" />
        </a>
  
        <div className="Nav__right">
            <NavLink className="Nav__link" activeClassName="active" to="/converse">Converse</NavLink>
            <NavLink className="Nav__link" activeClassName="active" to="/about">About</NavLink>
            {/* <NavLink className="Nav__link" activeClassName="active" to="/home">Home</NavLink> */}
        </div>
      </div>
    </nav>
    <hr/>
    </>
    )
  }

export default NavBar;