import React from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "./Logo.svg";

const Logo = () => {
  return (
    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
      <img src={logo} alt="Noleggio Veicoli" width={50} height={50} />
      <span className="font-weight-bold d-none d-md-inline">&nbsp;Noleggio Veicoli</span>
    </Navbar.Brand>
  );
};

export default Logo;
