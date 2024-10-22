import React, { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ReviewFormModal.css';

function ReviewFormModal({ spotId, onReviewSubmit }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = { review, stars };
    onReviewSubmit(reviewData);
    closeModal();
  };

  return (
    <div className="review-form-modal">
      <h2>How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
          required
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
        <button type="submit" disabled={review.length < 10 || stars === 0}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default ReviewFormModal;