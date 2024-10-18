import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);

  const spot = useSelector((state) => state.spots[spotId]);
  const currentUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchSpotAndReviews = async () => {
      try {
        const spotData = await dispatch(fetchSpotDetails(spotId));
        setReviews(spotData.Reviews);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          history.push("/not-found");
        } else {
          console.error("Error fetching spot details:", error);
        }
      }
    };
    fetchSpotAndReviews();
  }, [dispatch, spotId]);

  if (!spot) {
    return <div>Loading...</div>;
  }

  // Check for owner ONLY if spot and spot.Owner are defined
  const isOwner =
    spot && spot.Owner && currentUser && currentUser.id === spot.Owner.id;

  return (
    <div className="spot-detail-container">
      {/* ... [Your existing code for spot details (name, location, etc.) and images] ... */}

      <div className="reviews-section">
        <h2>View Ratings and Reviews</h2>
        <h2>
          <i className="star-icon">★</i>
          {spot.avgStarRating ? spot.avgStarRating.toFixed(1) : "New"}
          {spot.numReviews > 0 && (
            <>
              <span className="dot-separator"> · </span>
              <span>
                {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
              </span>
            </>
          )}
        </h2>

        {/* Display reviews or a message based on conditions */}
        {reviews.length > 0
          ? reviews.map((review) => (
              <div key={review.id} className="review-item">
                {/* ... [Your existing code for displaying individual review details (firstName, createdAt, review)] ... */}
              </div>
            ))
          : // Only show the message if there are no reviews AND the user is not the owner
            reviews.length === 0 &&
            !isOwner && (
              <p className="no-reviews-message">
                Be the first to post a review!
              </p>
            )}
      </div>
    </div>
  );
};

export default SpotDetail;
