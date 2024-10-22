import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import ProfileButton from './ProfileButton';
import UserMenu from '../UserMenu';
import { useModal } from '../../context/Modal';
import './Navigation.css';
import logo from '/logo.jpg'; 

const Navigation = () => {
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent } = useModal();

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
        {sessionUser ? (
          <>
            <NavLink to="/spots/new" className="create-spot-button">Create a New Spot</NavLink>
            <UserMenu user={sessionUser} />
            <NavLink to="/spots/current">Manage Spots</NavLink>
          </>
        ) : (
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