import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormModal from '../LoginFormModal';
import { useModal } from '../../context/Modal';
import './navigation.css';
import logo from '/logo.jpg';

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setModalContent } = useModal();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    setModalContent(<LoginFormModal />);
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
          <img src={logo} alt="Company Logo" className="logo-image" />
        </Link>
      </div>
      <div className="nav-right">
        {!sessionUser ? (
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
        ) : (
          <div className="menu-container">
            <button className="menu-button" onClick={toggleMenu}>
              Menu
            </button>
            {isMenuOpen && (
              <ul className="profile-dropdown">
                <li>Hello, {sessionUser.username}</li>
                {/* Other menu items for logged-in users can go here */}
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;