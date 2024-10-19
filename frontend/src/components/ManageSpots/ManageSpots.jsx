// src/components/ManageSpots/ManageSpots.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { fetchSpots, deleteSpot } from "../../store/spots";
import ConfirmationModal from "../ConfirmationModal";
import "./ManageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots.allSpots); // Get all spots from the store

  useEffect(() => {
    dispatch(fetchSpots()); // Fetch all spots when the component mounts
  }, [dispatch]);

  // Filter spots ONLY if currentUser is defined
  const ownedSpots = currentUser
    ? Object.values(spots).filter((spot) => spot.ownerId === currentUser.id)
    : []; // If currentUser is null, set ownedSpots to an empty array

  //state to control the confirmation modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //state to restore the ID of the spot to be deleted
  const [spotToDelete, setSpotToDelete] = useState(null);

  // Function to handle deleting a spot
  const handleDelete = async (spotId) => {
    await dispatch(deleteSpot(spotId));
    dispatch(fetchSpots()); // Re-fetch spots after deletion to update the list
  };

  return (
    <div className="manage-spots-container">
      <h2>Manage Spots</h2>

      {/* Conditionally render content based on whether the user has spots */}
      {ownedSpots.length > 0 ? (
        // If the user has spots, display them in a list
        <ul className="spot-list">
          {ownedSpots.map((spot) => (
            <li key={spot.id} className="spot-item">
              <Link to={`/spots/${spot.id}`} className="spot-link">
                <img
                  src={spot.previewImage}
                  alt={spot.name}
                  className="spot-image"
                />
                <div className="spot-info">
                  <h3>{spot.name}</h3>
                  <p>
                    {spot.city}, {spot.state}
                  </p>
                  {/* Display average rating (you might need to adjust based on your backend) */}
                  <p>
                    <i className="star-icon">★</i>
                    {spot.avgRating ? spot.avgRating.toFixed(1) : "New"}
                  </p>
                  <p>${spot.price}/night</p>
                </div>
              </Link>

              {/* "Update" and "Delete" buttons */}
              <div className="spot-actions">
                <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>
                  Update
                </button>
                <button
                  onClick={() => {
                    setSpotToDelete(spot.id); // Set the spot to be deleted
                    setShowDeleteModal(true); // Open the confirmation modal
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // If the user has no spots, display a message and a link to create a spot
        <div className="no-spots-message">
          <p>You don't have any spots yet.</p>
          <Link to="/spots/create" className="create-spot-link">
            Create a New Spot
          </Link>
        </div>
      )}

      {/* Confirmation Modal for deleting a spot */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Confirm Delete"
        message="Are you sure you want to remove this spot?"
        onConfirm={async () => {
          await handleDelete(spotToDelete);
          setShowDeleteModal(false);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ManageSpots;
