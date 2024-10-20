import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ProfileButton from "./ProfileButton";
import { Modal } from "../../context/Modal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser  = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  let sessionLinks;
  if (sessionUser ) {
    sessionLinks = (
      <ul>
        <li>
          <button onClick={() => navigate("/spots/create")}>
            Create a New Spot
          </button>
        </li>
        <li>
          <NavLink to="/spots/manage">Manage Spots</NavLink>
        </li>
        <li>
          <ProfileButton user={sessionUser } />
        </li>
      </ul>
    );
  } else {
    sessionLinks = (
      <ul>
        <OpenModalMenuItem
          itemText="Log In"
          modalComponent={<LoginFormModal />}
          onItemClick={() => setShowLoginModal(true)}
        />
        <OpenModalMenuItem
          itemText="Sign Up"
          modalComponent={<SignupFormModal />}
          onItemClick={() => setShowSignupModal(true)}
        />
      </ul>
    );
  }

  return (
    <nav className="navigation-container">
      <div className="nav-left">
        <NavLink to="/" className="logo-link">
          <img src="../../Assets/hotspotLogo.jpg" alt="HotSpot" className="logo" />
        </NavLink>
      </div>
      <ul className="nav-right">{isLoaded && sessionLinks}</ul>

      {/* Conditionally render modals for login and signup */}
      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)} show={showLoginModal}>
          <LoginFormModal />
        </Modal>
      )}
      {showSignupModal && (
        <Modal onClose={() => setShowSignupModal(false)} show={showSignupModal}>
          <SignupFormModal />
        </Modal>
      )}
    </nav>
  );
}

Navigation.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
};

export default Navigation;