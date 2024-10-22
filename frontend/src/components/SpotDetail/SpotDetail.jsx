import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails, deleteSpot } from "../../store/spots";
import { fetchSpotReviews, createReview } from "../../store/reviews";
import { FaStar } from "react-icons/fa";

import ReviewFormModal from "../ReviewFormModal";
import EditSpotForm from "../EditSpotForm";
import OpenModalButton from "../OpenModalButton";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spotReviews);
  const isLoading = useSelector((state) => state.spots.isLoading);
  const error = useSelector((state) => state.spots.error);
  const sessionUser = useSelector((state) => state.session.user);
  const [showEditForm, setShowEditForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch, spotId]);

  const handleReserve = () => {
    alert("Feature coming soon");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this spot?")) {
      await dispatch(deleteSpot(spotId));
      navigate("/");
    }
  };

  const renderRatingInfo = () => {
    if (!spot) return null;

    if (spot.numReviews === 0) {
      return (
        <>
          <FaStar /> New
        </>
      );
    } else {
      return (
        <>
          <FaStar />
          {spot.avgRating ? spot.avgRating.toFixed(1) : "N/A"}
          <span className="centered-dot"> · </span>
          {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}
        </>
      );
    }
  };

  const sortedReviews = reviews
    ? [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  const userCanReview =
    sessionUser &&
    spot &&
    sessionUser.id !== spot.Owner.id &&
    !sortedReviews.some((review) => review.User.id === sessionUser.id);

  const handleReviewSubmit = async (reviewData) => {
    try {
      setErrorMessage(""); // Clear any previous error messages
      const newReview = await dispatch(createReview(spotId, reviewData));
      if (newReview) {
        // Refresh the spot details and reviews
        await dispatch(fetchSpotDetails(spotId));
        await dispatch(fetchSpotReviews(spotId));
      } else {
        setErrorMessage("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMessage(
        "An error occurred while submitting your review. Please try again later."
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="spot-detail">
      {errorMessage && <p className="error">{errorMessage}</p>}
      {spot ? (
        <>
          <h1>{spot.name}</h1>
          <p>
            {spot.city}, {spot.state}, {spot.country}
          </p>

          <div className="image-gallery">
            {spot.SpotImages && spot.SpotImages.length > 0 && (
              <>
                <img
                  className="large-image"
                  src={spot.SpotImages[0].url}
                  alt="Main spot"
                />
                <div className="small-images">
                  {spot.SpotImages.slice(1, 5).map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Spot ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="spot-info">
            <div className="host-description">
              <h2>
                Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
              </h2>
              <p>{spot.description}</p>
            </div>

            <div className="spot-features">
              <h2>Features:</h2>
              <ul>
                {spot.features &&
                  spot.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
              </ul>
            </div>

            <div className="spot-rules">
              <h2>House Rules:</h2>
              <ul>
                {spot.rules &&
                  spot.rules.map((rule, index) => <li key={index}>{rule}</li>)}
              </ul>
            </div>
          </div>

          <div className="reviews-section">
            <h2>{renderRatingInfo()}</h2>

            {sortedReviews.length > 0 ? (
              sortedReviews.map((review) => (
                <div key={review.id} className="review">
                  <p>{review.User.firstName}</p>
                  <p>
                    {new Date(review.createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p>{review.review}</p>
                  <p>
                    <FaStar /> {review.stars}
                  </p>
                </div>
              ))
            ) : userCanReview ? (
              <div>
                <p>Be the first to post a review!</p>
                <OpenModalButton
                  buttonText="Write a review"
                  modalComponent={
                    <ReviewFormModal
                      spotId={spotId}
                      onReviewSubmit={handleReviewSubmit}
                    />
                  }
                />
              </div>
            ) : (
              <p>No reviews yet</p>
            )}
            {sessionUser &&
              sessionUser.id !== spot.Owner.id &&
              !sortedReviews.some(
                (review) => review.User.id === sessionUser.id
              ) && (
                <OpenModalButton
                  buttonText="Post Your Review"
                  modalComponent={
                    <ReviewFormModal
                      spotId={spotId}
                      onReviewSubmit={handleReviewSubmit}
                    />
                  }
                />
              )}
          </div>

          {sessionUser && sessionUser.id === spot.Owner.id && (
            <div className="owner-actions">
              <button onClick={handleDelete}>Delete Spot</button>
              <button onClick={() => setShowEditForm(true)}>Edit Spot</button>
              {showEditForm && (
                <EditSpotForm
                  spot={spot}
                  onClose={() => setShowEditForm(false)}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <p>Spot not found</p>
      )}
    </div>
  );
};

export default SpotDetail;
