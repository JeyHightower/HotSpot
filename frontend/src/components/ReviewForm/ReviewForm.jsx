import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "../../context/Modal";
import { createReview } from "../../store/reviews";
import StarRating from "../StarRating";
import "./ReviewForm.css";

const ReviewForm = ({ spotId, onClose, onReviewSubmit }) => {
  const dispatch = useDispatch();

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});

  //Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    //validate Form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //Create new review Object
    const newReview = {
      review: reviewText,
      stars: rating,
    };

    try {
      //dispatch the createReview thunk
      await dispatch(createReview(spotId, newReview));

      //clear form fields and close modal on success
      setReviewText("");
      setRating(0);
      onClose();
      onReviewSubmit();
    } catch (error) {
      //handle errors (display message)
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error creating review:", error);
      }
    }
  };

  //validate the form
  const validateForm = () => {
    const newErrors = {};
    if (reviewText.length < 10) {
      newErrors.review = "Review must be at least 10 characters long.";
    }
    if (rating === 0) {
      newErrors.rating = "Please select a star rating.";
    }
    return newErrors;
  };

  // Function to handle star rating selection
  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
  };

  return (
    <Modal onClose={onClose}>
      <div className="review-form-container">
        <h2>How was you stay?</h2>
        {/* display validation errors*/}
        {Object.keys(errors).length > 0 && (
          <ul className="errors-list">
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="review">
            Leave your review here ...
            <textarea
              id="review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Leave your review here..."
              required
            />
          </label>
          {/*Star Rating(need to implement component)*/}
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          <button
            type="submit"
            disabled={reviewText.length < 10 || rating === 0}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewForm;
