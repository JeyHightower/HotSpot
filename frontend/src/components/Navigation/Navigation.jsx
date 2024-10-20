import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ProfileButton from "./ProfileButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useModal } from "../../context/Modal"; // Import the useModal hook
import "./Navigation.css";
import logo from "../../../Assets/hotspotLogo.jpg"; // Ensure this path is correct

function Navigation({ isLoaded }) {
  const sessionUser  = useSelector((state) => state.session.user);
  const navigate = useNavigate();
  const { setModalContent, setOnModalClose } = useModal(); // Get modal context functions

  const handleLoginClick = () => {
    setModalContent(<LoginFormModal />);
    setOnModalClose(() => () => console.log("Login modal closed"));
  };

  const handleSignupClick = () => {
    setModalContent(<SignupFormModal />);
    setOnModalClose(() => () => console.log("Signup modal closed"));
  };

  let sessionLinks;
  if (sessionUser ) {
    sessionLinks = (
      <ul>
        <li>
          <button onClick={() => navigate("/spots/create")} aria-label="Create a New Spot">
            Create a New Spot
          </button>
        </li>
        <li>
          <NavLink to="/spots/manage">Manage Spots</NavLink>
        </li>
        <li>
          <ProfileButton user={sessionUser } data-testid="profile-button" />
        </li>
      </ul>
    );
  } else {
    sessionLinks = (
      <ul>
        <li>
          <button onClick={handleLoginClick}>Log In</button>
        </li>
        <li>
          <button onClick={handleSignupClick}>Sign Up</button>
        </li>
      </ul>
    );
  }

  return (
    <nav className="app-header">
      <NavLink to="/" className="app-logo" data-testid="logo">
        <img src={logo} alt="HotSpot Logo" className="logo" />
      </NavLink>
      <nav className="navigation-container">
        <ul className="nav-right">{isLoaded && sessionLinks}</ul>
      </nav>
    </nav>
  );
}

Navigation.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
};

export default Navigation;