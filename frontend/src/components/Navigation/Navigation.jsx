import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
       <li>
      <NavLink to="/login">Login</NavLink>
       </li>
       <li>
      <NavLink to="/signup">Signup</NavLink>
       </li>
      </>
    );
  }

  return (
    <nav className="navigation-container">
      <div className="nav-left">
       <NavLink to="/" className="logo-link">
         <img src="" alt="HotSpot" className="logo" />
       </NavLink>
      </div>
    <ul className="nav-right">
      {isLoaded && sessionLinks}
    </ul>
    </nav>
  );
}

Navigation.propTypes = {
  isLoaded: PropTypes.bool.isRequired
};

export default Navigation;