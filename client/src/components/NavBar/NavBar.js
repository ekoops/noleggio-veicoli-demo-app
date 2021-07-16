import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Logo from "./Logo/Logo";
import { NavLink } from "react-router-dom";
import api from "../../api/api";
import AuthContext from "../../contexts/AuthContext";

const NavBar = (props) => {
  const { logged, notLogged, setLogoutState, setError } = props;

  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    api.logout().then(setLogoutState).catch(setError);
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      className="justify-content-between"
      sticky="top"
    >
      <Logo />
      <Nav>
        {logged ? (
          <>
            <Navbar.Text className="text-light d-none d-md-inline-block">
              {user.email}&nbsp;|
            </Navbar.Text>
            <Nav.Link as={NavLink} to="/" exact>
              Prenota
            </Nav.Link>
            <Nav.Link as={NavLink} to="/rentals">
              Noleggi
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
        ) : null}
        {notLogged ? (
          <>
            <Nav.Link as={NavLink} to="/" exact>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/login">
              Login
            </Nav.Link>
          </>
        ) : null}
      </Nav>
    </Navbar>
  );
};

export default NavBar;
