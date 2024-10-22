// ConfirmationModal.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import { deleteReview } from '../../store/reviews';
import './ConfirmationModal.css';

function ConfirmationModal({ spotId, reviewId, onDelete, type }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    if (type === 'spot') {
      await dispatch(deleteSpot(spotId));
      onDelete(spotId);
    } else if (type === 'review') {
      await dispatch(deleteReview(reviewId));
      onDelete(reviewId);
    }
    closeModal();
  };

  const title = 'Confirm Delete';
  const message = type === 'spot' 
    ? 'Are you sure you want to remove this spot?'
    : 'Are you sure you want to delete this review?';
  const confirmText = type === 'spot' ? 'Yes (Delete Spot)' : 'Yes (Delete Review)';
  const cancelText = type === 'spot' ? 'No (Keep Spot)' : 'No (Keep Review)';

  return (
    <div className="confirm-delete-modal">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="button-container">
        <button className="yes-button" onClick={handleDelete} style={{backgroundColor: 'red', color: 'white'}}>
          {confirmText}
        </button>
        <button className="no-button" onClick={closeModal} style={{backgroundColor: '#333', color: 'white'}}>
          {cancelText}
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;