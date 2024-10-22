// src/components/ReviewForm/ReviewForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../../store/reviews'; // You'll need to create this action

const ReviewForm = ({ spotId, onReviewSubmit }) => {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(5);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = await dispatch(createReview(spotId, { review, stars }));
    if (newReview) {
      setReview('');
      setStars(5);
      onReviewSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review here..."
        required
      />
      <select value={stars} onChange={(e) => setStars(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num} Stars</option>
        ))}
      </select>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;