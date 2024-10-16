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
    <li>
      <NavLink to="/login">Login</NavLink>
    </li>
    );
  }

  return (
    <ul className="navigation-container">
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

Navigation.propTypes = {
  isLoaded: PropTypes.bool.isRequired
};

export default Navigation;