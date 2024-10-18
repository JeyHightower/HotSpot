import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spots"; // Import the thunk to create a spot
import "./SpotForm.css"; // Import CSS for styling

const SpotForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUser = useSelector((state) => state.session.user);

  // Initialize the state for all form fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(""); // Optional for MVP
  const [lng, setLng] = useState(""); // Optional for MVP
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  // State for additional image URLs (an array to hold up to 4 additional image URLs)
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);

  // State to keep track of any validation errors
  const [errors, setErrors] = useState({});

  // Get the errors from the Redux store's spots slice
  const errorsFromStore = useSelector((state) => state.spots.errors);

  // useEffect to update the errors state whenever errorsFromStore changes
  useEffect(() => {
    // If there are errors in the store, set the component's errors state
    if (errorsFromStore) {
      setErrors(errorsFromStore);
    }
  }, [errorsFromStore]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission

    // Call the validation function to check for errors
    const validationErrors = validateForm();
    // If validation errors exist, update the errors state and exit the function
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // If validation passes, create a new spot object with the form data
    const newSpot = {
      address,
      city,
      state,
      country,
      lat: parseFloat(lat) || null, // Parse lat and lng as floats (handling empty values)
      lng: parseFloat(lng) || null,
      name,
      description,
      price: parseFloat(price), // Parse price as a float
      previewImage,
    };

    // Use a try...catch block to handle potential errors during spot creation
    try {
      // Dispatch the createSpot thunk (which handles the backend API request)
      const createdSpot = await dispatch(createSpot(newSpot, imageUrls));

      // If the spot is created successfully:
      if (createdSpot) {
        // Clear the form fields by resetting state
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setLat("");
        setLng("");
        setName("");
        setDescription("");
        setPrice("");
        setPreviewImage("");
        setImageUrls(["", "", "", ""]); // Clear additional image URLs
        setErrors({}); // Clear any validation errors

        // Redirect the user to the newly created spot's details page
        history.push(`/spots/${createdSpot.id}`);
      }
    } catch (error) {
      // If an error occurs during spot creation
      if (error.response && error.response.data && error.response.data.errors) {
        // If the error response contains validation errors, update the errors state
        setErrors(error.response.data.errors);
      } else {
        // For other errors, log them to the console
        console.error("Error creating spot:", error);
      }
    }
  };
  // Validation helper function (you can add more validation rules here)
  const validateForm = () => {
    const newErrors = {};
    if (address.length === 0) newErrors.address = "Street address is required";
    if (city.length === 0) newErrors.city = "City is required";
    if (state.length === 0) newErrors.state = "State is required";
    if (country.length === 0) newErrors.country = "Country is required";
    if (name.length === 0) newErrors.name = "Name is required";
    if (description.length < 30)
      newErrors.description = "Description needs  30 or more characters";
    if (price.length === 0 || isNaN(price) || price <= 0)
      newErrors.price = "Price must be a positive number & is required";
    if (previewImage.length === 0)
      newErrors.previewImage = "Preview image URL is required";

    // Optional lat/lng validation - only check if one is provided
    if (
      (lat.length > 0 && lng.length === 0) ||
      (lat.length === 0 && lng.length > 0)
    ) {
      newErrors.coordinates =
        "Please provide both latitude and longitude, or leave both fields blank.";
    }

    return newErrors;
  };

  // Render the form
  return (
    <div className="spot-form-container">
      <h2>Create a New Spot</h2>

      {/* Conditionally render the errors list */}
      {Object.keys(errors).length > 0 && (
        <ul className="errors-list">
          {Object.values(errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      {/* The form with input fields */}
      <form onSubmit={handleSubmit}>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address"
          />
        </label>

        <label>
          City:
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </label>

        <label>
          State:
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
        </label>

        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
        </label>

        <label>
          Latitude (optional):
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
          />
        </label>

        <label>
          Longitude (optional):
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
          />
        </label>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spot name"
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </label>

        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />
        </label>

        <label>
          Preview Image:
          <input
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview image URL"
          />
        </label>

        {/* Additional image URLs */}
        <label>
          Additional Image 1:
          <input
            type="text"
            value={imageUrls[0]}
            onChange={(e) =>
              setImageUrls([e.target.value, ...imageUrls.slice(1)])
            }
            placeholder="Additional image URL 1"
          />
        </label>

        <label>
          Additional Image 2:
          <input
            type="text"
            value={imageUrls[1]}
            onChange={(e) =>
              setImageUrls([
                imageUrls[0],
                e.target.value,
                ...imageUrls.slice(2),
              ])
            }
            placeholder="Additional image URL 2"
          />
        </label>

        <label>
          Additional Image 3:
          <input
            type="text"
            value={imageUrls[2]}
            onChange={(e) =>
              setImageUrls([
                imageUrls[0],
                imageUrls[1],
                e.target.value,
                ...imageUrls.slice(3),
              ])
            }
            placeholder="Additional image URL 3"
          />
        </label>

        <label>
          Additional Image 4:
          <input
            type="text"
            value={imageUrls[3]}
            onChange={(e) =>
              setImageUrls([
                imageUrls[0],
                imageUrls[1],
                imageUrls[2],
                e.target.value,
              ])
            }
            placeholder="Additional image URL 4"
          />
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default SpotForm;
