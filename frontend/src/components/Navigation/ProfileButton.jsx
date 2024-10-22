import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { FaUser } from "react-icons/fa6";
import "./ProfileButton.css";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const menuContentRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      setShowMenu(false);
      history("/");
    });
  };

  const handleMenuContentClick = (e) => {
    e.stopPropagation();
  };

  const ulClassName = `profile-dropdown${showMenu ? "" : " hidden"}`;

  const manageSpots = () => {
    history.pushState("/spots/manage");
    closeMenu();
  };

  return (
    <div className="profile-button-container">
      <button
        onClick={openMenu}
        data-testid="user-menu-button"
        className="profile-button"
        aria-label="User  menu"
      >
        <FaUser />
        {user ? user.username : "Profile"}
      </button>
      {showMenu && (
        <div
          className={ulClassName}
          data-testid="user-dropdown-menu"
          ref={ulRef}
        >
          {user ? (
            <div className="profile-details" onClick={handleMenuContentClick}>
              <span className="greeting">
                Hello, {user.firstName || user.username}!
              </span>
              <span className="email">{user.email}</span>
              <button onClick={manageSpots}>Manage Spots</button>
              <button onClick={logout} className="logout-button">
                Log Out
              </button>
            </div>
          ) : (
            <>
              <div className="auth-links">
                <Link to="/login" className="login-link">
                  Log In
                </Link>
              </div>
              <div className="auth-links">
                <Link to="/signup" className="signup-link">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
