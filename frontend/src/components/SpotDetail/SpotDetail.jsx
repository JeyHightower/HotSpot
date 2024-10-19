import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { fetchUserReviews } from "../../store/reviews"; // Import the thunk to fetch user reviews
import ReviewForm from "../ReviewForm/ReviewForm";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  // State variables
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPostedReview, setHasPostedReview] = useState(false);

  // Get spot data from the Redux store
  const spot = useSelector((state) => state.spots[spotId]);
  // Get the current user from the Redux store
  const currentUser = useSelector((state) => state.session.user);

  // Fetch spot details and reviews when the component mounts or spotId changes
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

  // Fetch user reviews to check if the user has already reviewed the spot
  useEffect(() => {
    const fetchCurrentUserReviews = async () => {
      if (currentUser) {
        const userReviewData = await dispatch(fetchUserReviews());

        // Check if the user has a review for this spot
        const hasReview = userReviewData.some(
          (review) => review.spotId === +spotId
        );
        setHasPostedReview(hasReview);
      }
    };
    fetchCurrentUserReviews();
  }, [currentUser, spotId]);

  // While waiting for the spot data, display a loading message
  if (!spot) {
    return <div>Loading...</div>;
  }

  // Determine if the current user is the owner of the spot
  const isOwner =
    spot && spot.Owner && currentUser && currentUser.id === spot.Owner.id;

  // Determine if the user can post a review
  const canPostReview = currentUser && !isOwner && !hasPostedReview;

  // Function to handle refreshing spot details after a new review is submitted
  const handleReviewSubmit = async () => {
    await dispatch(fetchSpotDetails(spotId)); // Re-fetch spot details to include the new review
  };

  return (
    <div className="spot-detail-container">
      {/* ... [Your existing code for spot details (name, location, etc.) and images] ... */}

      {/* Container for the reviews section */}
      <div className="reviews-section">
        <h3>Reviews</h3>

        {/* Conditionally render the "Post Your Review" button */}
        {canPostReview && (
          <button onClick={() => setShowReviewForm(true)}>
            Post Your Review
          </button>
        )}

        {/* Conditionally render the ReviewForm modal */}
        {showReviewForm && (
          <ReviewForm
            spotId={spotId}
            onClose={() => setShowReviewForm(false)}
            onReviewSubmit={handleReviewSubmit} // Pass the function to re-fetch spot details
          />
        )}

        {/* ... [Your existing code for displaying reviews and the "Be the first" message] ... */}
      </div>
    </div>
  );
};

export default SpotDetail;
