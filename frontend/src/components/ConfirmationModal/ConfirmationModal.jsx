// ConfirmDeleteModal.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import './ConfirmationModal.css';

function ConfirmDeleteModal({ spotId, onDelete }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    onDelete(spotId);
    closeModal();
  };

  return (
    <div className="confirm-delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="button-container">
        <button className="delete-button" onClick={handleDelete} style={{backgroundColor: 'red', color: 'white'}}>
          Yes (Delete Spot)
        </button>
        <button className="cancel-button" onClick={closeModal} style={{backgroundColor: '#333', color: 'white'}}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;