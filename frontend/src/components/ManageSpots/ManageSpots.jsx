// src/components/ManageSpots/ManageSpots.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserSpots } from '../../store/spots'; // You'll need to create this action

function ManageSpots() {
  const dispatch = useDispatch();
  const userSpots = useSelector(state => state.spots.userSpots);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserSpots());
    }
  }, [dispatch, user]);

  if (!user) {
    return <h2>Please log in to manage your spots.</h2>;
  }

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      {userSpots.length === 0 ? (
        <Link to="/spots/new">Create a New Spot</Link>
      ) : (
        <ul>
          {userSpots.map(spot => (
            <li key={spot.id}>
              <Link to={`/spots/${spot.id}`}>{spot.name}</Link>
              {/* Add more details or management options here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageSpots;