import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import ProfileButton from './ProfileButton';
import { useModal } from '../../context/Modal';
import './Navigation.css';
import logo from '/logo.jpg'; 

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent } = useModal();

  // Handler for opening the login modal
  const handleLogin = () => {
    setModalContent(<LoginFormModal />);
  };

  // Handler for opening the signup modal
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
        {sessionUser ? (
          // If user is logged in, show the ProfileButton
          <ProfileButton user={sessionUser} />
        ) : (
          // If user is logged out, show Login and Sign Up buttons
          <>
            <button className="login-button" onClick={handleLogin}>Log In</button>
            <button className="signup-button" onClick={handleSignUp}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;