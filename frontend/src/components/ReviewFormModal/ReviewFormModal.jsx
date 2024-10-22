import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/Modal';
import './ReviewFormModal.css';

function ReviewFormModal({ spotId, onReviewSubmit }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const [serverError, setServerError] = useState('');
  const { closeModal } = useModal();

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  const resetForm = () => {
    setReview('');
    setStars(0);
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    try {
      const reviewData = { review, stars };
      await onReviewSubmit(reviewData);
      resetForm();
      closeModal();
    } catch (error) {
      setServerError(error.message || 'An error occurred while submitting your review.');
    }
  };

  const isSubmitDisabled = review.length < 10 || stars === 0;

  return (
    <div className="review-form-modal">
      <h2>How was your stay?</h2>
      {serverError && <p className="error">{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
          required
          minLength={10}
        />
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= stars ? 'star filled' : 'star'}
              onClick={() => setStars(star)}
            >
              ★
            </span>
          ))}
          <span>Stars</span>
        </div>
        <button type="submit" disabled={isSubmitDisabled}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewFormModal;