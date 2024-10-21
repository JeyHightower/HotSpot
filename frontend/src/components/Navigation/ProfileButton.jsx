import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import  {FaUser}  from 'react-icons/fa6';
import './ProfileButton.css';

function ProfileButton({ user }) {
    console.log('ProfileButton: user', user);
    // ... rest of the component
  
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = `profile-dropdown${showMenu ? "" : " hidden"}`;

  return (
    <div className="profile-button-container">
      <button onClick={openMenu} data-testid="user-menu-button" className="profile-button" aria-label="User menu">
      &#x1F464;
        {user ? user.username : 'Profile'}
      </button>
      {showMenu && (
        <div className={ulClassName} data-testid="user-dropdown-menu" ref={ulRef}>
          {user ? (
            <div className="profile-details">
              <span className="username">Hello, {user.username}!</span>
              <span className="email">{user.email}</span>
              <button onClick={logout} className="logout-button">Log Out</button>
            </div>
          ) : (
            <>
              <div className="auth-links">
                <Link to="/login" className="login-link">Log In</Link>
              </div>
              <div className="auth-links">
                <Link to="/signup" className="signup-link">Sign Up</Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileButton ;