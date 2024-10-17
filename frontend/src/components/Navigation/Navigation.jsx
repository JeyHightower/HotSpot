import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ProfileButton from "./ProfileButton";
import { Modal } from "./Modal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal"; // Corrected typo here
import "./Navigation.css";

//!Navigation Functional Component
function Navigation({ isLoaded }) {
  //!get the current user's session information from the redux store.
  const sessionUser = useSelector((state) => state.session.user);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  //! determine which links to display based on whether the user is logged in or not
  let sessionLinks;
  //! If user IS logged in, render the ProfileButton component
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    //! If user IS NOT logged in, render the Log In and Sign Up buttons
    sessionLinks = (
      <>
        <li>
          <OpenModalMenuItem
            itemText="Log In"
            modalComponent={<LoginFormModal />}
            onItemClick={() => setShowLoginModal(true)}
          />
        </li>
        <li>
          <OpenModalMenuItem
            itemText="Sign Up"
            modalComponent={<SignupFormModal />}
            onItemClick={() => setShowSignupModal(true)}
          />
        </li>
      </>
    );
  }
  //! render the navigation bar jsx
  return (
    <nav className="navigation-container">
      <div className="nav-left">
        <NavLink to="/" className="logo-link">
          <img src="" alt="HotSpot" className="logo" />
        </NavLink>
      </div>
      //! Conditionally render navigation links based on isLoaded
      <ul className="nav-right">
        {isLoaded && sessionLinks} {/* Simplified conditional rendering */}
      </ul>
      //!Render Modals
      <Modal onClose={() => setShowLoginModal(false)} show={showLoginModal}>
        <LoginFormModal />
      </Modal>
      <Modal onClose={() => setShowSignupModal(false)} show={showSignupModal}>
        <SignupFormModal />
      </Modal>
    </nav>
  );
}
//!prop type validations
Navigation.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
};

export default Navigation;
