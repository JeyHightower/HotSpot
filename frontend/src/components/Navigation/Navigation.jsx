import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
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
    setModalContent(<SignupFormModal />);
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
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
          </>
        ) : (
          <div className="menu-container">
            <button className="menu-button" onClick={toggleMenu}>
              User Menu
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