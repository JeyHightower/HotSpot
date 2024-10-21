import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className="app-header">
      <div className="header-container">
        <NavLink to="/" className="app-logo">
          <img src="/logo.jpg" alt="HOTSPOTS" data-testid="logo" className="logo" />
        </NavLink>
        <nav className="navigation-container">
          {isLoaded && (
            <div className="nav-right">
              <ProfileButton user={sessionUser} />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;