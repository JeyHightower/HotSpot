import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import the star icon
import './SpotCard.css';

function SpotCard({ spot }) {
  const history = useNavigate();

  const handleClick = () => {
    history.push(`/spots/${spot.id}`);
  };

  return (
    <div className="spot-card" onClick={handleClick} title={spot.name}>
      <img src={spot.previewImage} alt={spot.name} className="spot-image" />
      <div className="spot-info">
        <p className="spot-location">{spot.city}, {spot.state}</p>
        <p className="spot-rating">
          <FaStar /> {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
        </p>
        <p className="spot-price">${spot.price} night</p>
      </div>
    </div>
  );
}

export default SpotCard;