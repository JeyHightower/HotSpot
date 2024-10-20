import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history("/");
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} data-testid="user-menu-button"> {/* Added data-testid */}
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user && (
          <>
            <li>Hello, {user.firstName}</li>
            <li>{user.username}</li>
            <li>
              {user.firstName} {user.lastName}
            </li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        )}
      </ul>
    </>
  );
}

ProfileButton.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};

export default ProfileButton;