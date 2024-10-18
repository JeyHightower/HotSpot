import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots"; // Import the thunk to fetch spot details
import "./SpotDetail.css"; // Import CSS for styling

const SpotDetail = () => {
  // Get the spotId from the URL parameters
  const { spotId } = useParams();
  // Get the history object for redirection
  const history = useHistory();
  // Get the dispatch function from Redux
  const dispatch = useDispatch();

  // Select the spot data from the Redux store based on the spotId
  const spot = useSelector((state) => state.spots[spotId]);

  // Use useEffect to fetch the spot details when the component mounts or spotId changes
  useEffect(() => {
    dispatch(fetchSpotDetails(spotId)).catch((error) => {
      // Handle potential errors during fetching
      if (error.response && error.response.status === 404) {
        // If the spot is not found (404 error), redirect to a 404 page
        history.push("/not-found");
      } else {
        // For other errors, you might want to log them or display a user-friendly message
        console.error("Error fetching spot details:", error);
      }
    });
  }, [dispatch, spotId]);

  // While waiting for the spot data, display a loading message
  if (!spot) {
    return <div>Loading...</div>;
  }

  //Function to handle the 'Reserve' button click

  const handleReserveClick = () => {
    //redirect tot he reservation form page
    history.push(`/reserve/${spotId}`);
  };

  return (
    <div className="spot-detail-container">
      {/* Container for the spot details */}
      <div className="spot-details">
        <h2>{spot.name}</h2> {/* Display the spot name */}
        <p>
          Location: {spot.city}, {spot.state}
        </p>{" "}
        {/* Display the spot location */}
        <p className="description">{spot.description}</p>{" "}
        {/* Display the spot description */}
        <h3>
          ${spot.price} <span>night</span>
        </h3>{" "}
        {/* Display the spot price per night */}
        <button onClick={handleReserveClick}>Reserve</button>
        {/*add a reserve button*/}
      </div>

      {/* Container for the spot images */}
      <div className="images">
        {spot.images.map((imageUrl, index) => (
          // Map through the spot.images array to display each image
          <img
            key={index}
            src={imageUrl}
            alt={`${spot.name} - Image ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SpotDetail;
