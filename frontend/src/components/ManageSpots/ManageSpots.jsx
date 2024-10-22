// src/components/ManageSpots/ManageSpots.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserSpots } from '../../store/spots';
import OpenModalButton from '../OpenModalButton';
import ConfirmationModal from '../ConfirmationModal';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    navigate(`/spots/${spotId}`);
  };

  const handleUpdate = (spotId, event) => {
    event.stopPropagation();
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDelete = (deletedSpotId) => {
    // This will update the Redux store, which will cause a re-render
    dispatch(fetchUserSpots());
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
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<ConfirmationModal spotId={spot.id} onDelete={handleDelete} />}
                  onButtonClick={(e) => e.stopPropagation()} // Prevent the spot click event
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSpots;