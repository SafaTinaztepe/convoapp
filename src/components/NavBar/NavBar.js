import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"

const NavBar = () => {
    return (
      <nav className="Nav">
        <div className="Nav__container">
        <a href="/" className="Nav__brand">
          <img src="logo.svg" className="Nav__logo" />
        </a>
  
        <div className="Nav__right">
            <a className="Nav__link active" href="/converse">Converse</a>
            <a className="Nav__link" href="/about">About</a>
            <a className="Nav__link" href="/">Home</a>
        </div>
      </div>
    </nav>
    )
  }

export default NavBar;