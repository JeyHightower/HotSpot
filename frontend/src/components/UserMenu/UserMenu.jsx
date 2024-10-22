import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function UserMenu({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  return (
    <div className="user-menu">
      <button onClick={() => setShowMenu(!showMenu)}>
        {user.username}
      </button>
      {showMenu && (
        <ul className="dropdown">
          <li>{user.email}</li>
          <li>{user.firstName} {user.lastName}</li>
          <li><button onClick={logout}>Log out</button></li>
        </ul>
      )}
    </div>
  );
}

export default UserMenu;