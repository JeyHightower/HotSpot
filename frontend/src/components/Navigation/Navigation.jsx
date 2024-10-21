import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <nav className="navigation">
      <div className="nav-left">
        <NavLink to="/">Home</NavLink>
      </div>
      <div className="nav-right">
        {isLoaded && (
          <>
            {sessionUser ? (
              <div className="menu-container">
                <button onClick={toggleMenu} className="menu-button">Menu</button>
                <ul className={ulClassName} ref={ulRef}>
                  <li>{sessionUser.username}</li>
                  <li>{sessionUser.email}</li>
                  <li>
                    <button onClick={closeMenu}>Log Out</button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button onClick={() => alert('Log In clicked')} className="login-button">Log In</button>
                <div className="menu-container">
                  <button onClick={toggleMenu} className="menu-button">Menu</button>
                  <ul className={ulClassName} ref={ulRef}>
                    <li>
                      <button onClick={() => alert('Sign Up clicked')}>Sign Up</button>
                    </li>
                    {/* Add any additional menu items here */}
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;