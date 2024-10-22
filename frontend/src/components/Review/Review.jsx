// Review.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteReview } from "../../store/reviews"; // Update this path as needed
import ConfirmationModal from "../ConfirmationModal"; // Update this path as needed

const Review = ({ review }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    await dispatch(deleteReview(review.id));
    setShowModal(false);
  };

  return (
    <div className="review">
      <p>{review.content}</p>
      <p>Rating: {review.rating}</p>
      {currentUser && currentUser.id === review.userId && (
        <button onClick={handleDeleteClick} className="delete-button">
          Delete
        </button>
      )}
      <ConfirmationModal
        spotId={null}
        reviewId={review.id}
        onDelete={handleConfirmDelete}
        type="review"
        isOpen={showModal}
        closeModal={() => setShowModal(false)}
      />
    </div>
  );
};

export default Review;