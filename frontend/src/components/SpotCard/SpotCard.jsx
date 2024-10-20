import React from "react";
import { Link } from "react-router-dom";
import "./SpotCard.css";

function SpotCard({ spot }) {
  //! determine the star rating to display
  const starRating = spot.avgRating ? spot.avgRating.toFixed(1) : "New";
  

  return (
    <Link to={`/spots/${spot.id}`} className="spot-card">
      <div className="spot-card-image">
        <img src={spot.previewImage} alt={spot.name} />
      </div>
      <div className="spot-card-details">
        <div className="spot-card-reviews">
          {/* conditionally render the review count only if there are reviews*/}
          {spot.numReviews > 0 && (
            <>
            <span className="dot-separator"> · </span>
            <span>
              {spot.numReviews}{""}
              {spot.numReviews === 1 ? "Review" : "Reviews"}
              </span>
              </>
          )}
        </div>
        <div className="spot-card-location">
          {spot.city}, {spot.state}
        </div>
        <div className="spot-card-name" title={spot.name}>
          {spot.name}
        </div>
        <div className="spot-card-rating">
          <span className="star-icon">*</span>
          {starRating}
        </div>
        <div className="spot-card-price">${spot.price} night</div>
      </div>
    </Link>
  );
}

export default SpotCard;
