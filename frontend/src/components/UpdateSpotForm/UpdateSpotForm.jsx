import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory if using React Router v6
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails, updateSpot } from "../../store/spots";
import "./UpdateSpotForm.css";

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const history = useNavigate(); // Updated to useNavigate
  const dispatch = useDispatch();

  // Select the spot details from the Redux store
  const spot = useSelector((state) => state.spots.singleSpot);
  const currentUser = useSelector((state) => state.session.user);

  // Initialize form field states
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState({});

  // Fetch the spot details when the component mounts
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
      } catch (error) {
        // Handle the error appropriately
        console.error("Error fetching spot details:", error);
        // You might want to display an error message to the user or take other actions
      }
    };

    fetchSpot();
  }, [dispatch, spotId]);
  // Update form fields when spot details change
  useEffect(() => {
    if (spot) {
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setCountry(spot.country || "");
      setLat(spot.lat || "");
      setLng(spot.lng || "");
      setName(spot.name || "");
      setDescription(spot.description || "");
      setPrice(spot.price || "");
      setPreviewImage(spot.previewImage || "");
      // Initialize imageUrls if needed
    }
  }, [spot]);

  //check if the current user is the owner of the spot
  const isOwner = spot && currentUser && spot.ownerId === currentUser.id;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //if the user is NOT the owner, redirect them to the spot details page
    if (!isOwner) {
      history(`/spots/${spot.id}`);
      return;
    }

    // Validate the form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedSpot = {
      address,
      city,
      state,
      country,
      lat: parseFloat(lat) || null,
      lng: parseFloat(lng) || null,
      name,
      description,
      price: parseFloat(price),
      previewImage,
    };

    try {
      await dispatch(updateSpot(spotId, updatedSpot, imageUrls));
      navigate(`/spots/${spotId}`); // Use navigate for redirection
    } catch (error) {
      setErrors({ general: "Failed to update the spot. Please try again." });
      console.error("Error updating spot:", error);
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};

    // Validate address
    if (!address) {
      errors.address = "Address is required";
    }

    // Validate city
    if (!city) {
      errors.city = "City is required";
    }

    // Validate state
    if (!state) {
      errors.state = "State is required";
    }

    // Validate country
    if (!country) {
      errors.country = "Country is required";
    }

    // Validate lat and lng
    if (!lat || !lng) {
      errors.lat = "Latitude and longitude are required";
    }

    // Validate name
    if (!name) {
      errors.name = "Name is required";
    }

    // Validate description
    if (!description) {
      errors.description = "Description is required";
    }

    // Validate price
    if (!price || isNaN(price) || price <= 0) {
      errors.price = "Price must be a positive number";
    }

    return errors;
  };

  // Handle changes in additional image URLs
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  return (
    <div className="update-spot-form-container">
      <h2>Update Your Spot</h2>

      {/* Display validation errors at the top */}
      {Object.keys(errors).length > 0 && (
        <ul className="errors-list">
          {Object.values(errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {/* Form to update the spot */}
      <form onSubmit={handleSubmit}>
        {/* Where's Your Place Located? Section */}
        <h3>Where is your place located?</h3>
        <p>
          Guests will only get your exact address once they have booked a
          reservation.
        </p>

        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          required
        />
        {errors.country && <div style={{ color: "red" }}>{errors.country}</div>}

        <label htmlFor="address">Street Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street address"
          required
        />
        {errors.address && <div style={{ color: "red" }}>{errors.address}</div>}

        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          required
        />
        {errors.city && <div style={{ color: "red" }}>{errors.city}</div>}

        <label htmlFor="state">State</label>
        <input
          type="text"
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          required
        />
        {errors.state && <div style={{ color: "red" }}>{errors.state}</div>}

        {/* Latitude and Longitude (Optional) */}
        <label htmlFor="lat">Latitude (optional)</label>
        <input
          type="text"
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
        />
        {errors.lat && <div style={{ color: "red" }}>{errors.lat}</div>}

        <label htmlFor="lng">Longitude (optional)</label>
        <input
          type="text"
          id="lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
        />
        {errors.lng && <div style={{ color: "red" }}>{errors.lng}</div>}

        {/* Describe Your Place to Guests Section */}
        <div className="form-section">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            required
          />
          {errors.description && (
            <div style={{ color: "red" }}>{errors.description}</div>
          )}
        </div>

        {/* Create a Title for Your Spot Section */}
        <div className="form-section">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guest attention with a spot title that highlights what makes
            your place special.
          </p>
          <label htmlFor="name">Name of your spot</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            required
          />
          {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
        </div>

        {/* Set a Price for Your Spot Section */}
        <div className="form-section">
          <h3>Set a price for your spot</h3>
          <p>
            Set a competitive nightly price for your spot. You can adjust it
            later.
          </p>
          <label htmlFor="price">Price per night</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night"
            required
          />
          {errors.price && <div style={{ color: "red" }}>{errors.price}</div>}
        </div>

        {/* Add Photos of Your Spot Section */}
        <div className="form-section">
          <h3>Add photos of your spot</h3>
          <p>
            Showcase your spot best features with high-quality photos. Guests
            will be able to see them when they book.
          </p>
          <label>Preview Image (required)</label>
          <input
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview image URL"
            required
          />
          {errors.previewImage && (
            <div style={{ color: "red" }}>{errors.previewImage}</div>
          )}

          <label>Additional Image URLs (optional)</label>
          {imageUrls.map((imageUrl, index) => (
            <input
              key={index}
              type="text"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
            />
          ))}
        </div>

        {/* Submit button */}
        <button type="submit">Update Your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;
