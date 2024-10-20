// src/components/Header/Header.jsx
import React from 'react';
import './header.css';
import ProfileButton from '../Navigation/ProfileButton'; // Import the ProfileButton component
import { useSelector } from 'react-redux'; // Import useSelector to access user info

const Header = () => {
  const user = useSelector((state) => state.session.user); // Get the current user from the Redux store

  return (
    <header data-testid="header">
      <div className="logo-container">
        <img
          data-testid="logo"
          src="/logo.jpg" // Ensure this path is correct
          alt="Logo"
          onClick={() => window.location.href = '/'} // Redirects to home on click
        />
      </div>
      <div className="auth-buttons-container">
        <ProfileButton user={user} /> {/* Pass the user prop to ProfileButton */}
      </div>
    </header>
  );
};

export default Header;