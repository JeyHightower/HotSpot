import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

//! ProfileButton functional component
function ProfileButton({ user }) {
  const dispatch = useDispatch(); // Access the Redux dispatch function
  const [showMenu, setShowMenu] = useState(false); // State to manage the visibility of the user menu dropdown
  const ulRef = useRef(); // Ref to the <ul> element of the dropdown
  const navigate = useNavigate(); // get the navigation function
  //! Function to toggle the user menu (show/hide)
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up to the document (which would close the menu immediately)
    setShowMenu(!showMenu); // Toggle the showMenu state
  };

  //! useEffect to handle closing the menu when clicking outside of it
  useEffect(() => {
    //! If the menu is not open, do nothing (return early)
    if (!showMenu) return;

    //! Function to close the menu if the click is outside the dropdown
    const closeMenu = (e) => {
      //! If the clicked element is not within the dropdown (<ul> element), close the menu
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    //! Add the 'click' event listener to the document
    document.addEventListener("click", closeMenu);

    //! Cleanup: Remove the event listener when the component unmounts or the showMenu state changes
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]); // Run this effect only when showMenu changes

  //! Function to close the menu
  const closeMenu = () => setShowMenu(false);

  //! Function to handle the logout action
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()); // Dispatch the logout action to the Redux store
    closeMenu(); // Close the user menu after logout
    navigate("/"); // Navigate to the homepage after logout
  };

  //! Determine the class name for the dropdown based on its visibility
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  //! Render the JSX for the ProfileButton component
  return (
    <>
      //! Button to toggle the user menu
      <button onClick={toggleMenu}>
        <FaUserCircle /> {/* User icon */}
      </button>
      //! Dropdown menu
      <ul className={ulClassName} ref={ulRef}>
        //! Conditionally render user info only if user is logged in
        {user && (
          <>
            //! add Greeting
            <li>Hello, {user.firstName}</li>
            //! Display the user's username, full name, and email
            <li>{user.username}</li>
            <li>
              {user.firstName} {user.lastName}
            </li>
            <li>{user.email}</li>
            //! Logout button
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

//! Prop Type Validation
ProfileButton.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default ProfileButton;
