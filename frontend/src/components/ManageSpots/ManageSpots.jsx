// src/components/ManageSpots/ManageSpots.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserSpots } from '../../store/spots'; // You'll need to create this action
import './ManageSpots.css'; // Create this CSS file for styling

function ManageSpots() {
  const dispatch = useDispatch();
  const history = useNavigate();
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

  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  const handleUpdate = (spotId, event) => {
    event.stopPropagation();
    // Implement update functionality or navigation
    console.log('Update spot', spotId);
  };

  const handleDelete = (spotId, event) => {
    event.stopPropagation();
    // Implement delete functionality
    console.log('Delete spot', spotId);
  };

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      {userSpots.length === 0 ? (
        <Link to="/spots/new">Create a New Spot</Link>
      ) : (
        <div className="spot-list">
          {userSpots.map(spot => (
            <div 
              key={spot.id} 
              className="spot-tile" 
              onClick={() => handleSpotClick(spot.id)}
            >
              <img src={spot.previewImage} alt={spot.name} />
              <div className="spot-info">
                <p>{spot.city}, {spot.state}</p>
                <p>★ {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</p>
                <p>${spot.price} night</p>
              </div>
              <div className="spot-actions">
                <button onClick={(e) => handleUpdate(spot.id, e)}>Update</button>
                <button onClick={(e) => handleDelete(spot.id, e)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSpots;