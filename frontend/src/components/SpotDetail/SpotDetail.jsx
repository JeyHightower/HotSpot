import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { fetchUserReviews } from "../../store/reviews"; // Import the thunk to fetch user reviews
import ReviewForm from "../ReviewForm/ReviewForm";
import ConfirmationModal from "../ConfirmationModal";
import { deleteReview } from "../../store/reviews";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  // State variables
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPostedReview, setHasPostedReview] = useState(false);
  const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

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

  //function to handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview(reviewId));
    await dispatch(fetchSpotDetails(spotId));
  };

  return (
    <div className="spot-detail-container">
      {/* Container for the spot details */}
      <div className="spot-details">
        <h2>{spot.name}</h2>
        <p>
          Location: {spot.city}, {spot.state}
        </p>
        <p className="description">{spot.description}</p>
        <h3>
          ${spot.price} <span>night</span>
        </h3>

        {/* Display the average rating and review count */}
        <div className="rating-summary">
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
        </div>

        {/* Button to redirect to reservation form (assuming you have a /reserve route) */}
        <button onClick={() => history.push(`/spots/${spot.id}/reserve`)}>
          Reserve
        </button>
      </div>

      {/* Container for the spot images */}
      <div className="images">
        {spot.SpotImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`${spot.name} - Image ${index}`}
          />
        ))}
      </div>

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
            onReviewSubmit={handleReviewSubmit}
          />
        )}

        {/* Display the reviews */}
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <p>
                <i className="star-icon">★</i>
                {review.rating} / 5
              </p>
              <p>{review.review}</p>
              <p>
                — {review.User.username} on{" "}
                {review.createdAt.toLocaleDateString()}
              </p>

              {/* Conditionally render the "Delete" button for each review */}
              {currentUser && review.userId === currentUser.id && (
                <button
                  onClick={() => {
                    setReviewToDelete(review.id);
                    setShowDeleteReviewModal(true);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Be the first to review this spot!</p>
        )}

        {/* Confirmation Modal for deleting a review */}
        <ConfirmationModal
          show={showDeleteReviewModal}
          title="Confirm Delete"
          message="Are you sure you want to delete this review?"
          onConfirm={async () => {
            await handleDeleteReview(reviewToDelete);
            setShowDeleteReviewModal(false);
          }}
          onCancel={() => setShowDeleteReviewModal(false)}
        />
      </div>
    </div>
  );
};

export default SpotDetail;
