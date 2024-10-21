import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navigation.css';
import logo from '/logo.jpg';

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    // Implement login logic here
    setIsLoggedIn(true);
    setUsername('JohnDoe'); // Set this to the actual username after login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setIsMenuOpen(false);
  };

  const handleSignUp = () => {
    // Implement sign up logic here
    console.log("Sign Up clicked");
    // You might want to redirect to a sign-up page or open a sign-up modal
  };

  return (
    <nav className="navigation">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
        <img src={logo} alt="Company Logo" className="logo-image" /></Link>
      </div>
      <div className="nav-right">
        {!isLoggedIn && (
          <>
            <button className="login-button" onClick={handleLogin}>Log In</button>
            <div className="menu-container">
              <button className="menu-button" onClick={toggleMenu}>
                Menu
              </button>
              {isMenuOpen && (
                <ul className="profile-dropdown">
                  <li><button onClick={handleSignUp}>Sign Up</button></li>
                </ul>
              )}
            </div>
          </>
        )}
        {isLoggedIn && (
          <div className="menu-container">
            <button className="menu-button" onClick={toggleMenu}>
              Menu
            </button>
            {isMenuOpen && (
              <ul className="profile-dropdown">
                <li>Logged in as {username}</li>
                <li><button onClick={handleLogout}>Log Out</button></li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;