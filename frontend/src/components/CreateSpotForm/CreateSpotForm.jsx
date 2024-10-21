// src/components/CreateSpotForm/CreateSpotForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSpot } from "../../store/spots";
import "./CreateSpotForm.css";

const CreateSpotForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",
  });
  const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (formData.description.length < 30)
      newErrors.description = "Description needs a minimum of 30 characters";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";

    if (!imageUrls[0].trim())
      newErrors.images = "At least one image URL is required";

    // Validate image URLs
    const validImageUrls = imageUrls.filter((url) => url.trim() !== "");
    validImageUrls.forEach((url, index) => {
      if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(url)) {
        newErrors[`imageUrl${index}`] =
          "Invalid image URL. Must end with .jpg, .jpeg, .png, or .gif";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (validateForm()) {
      try {
        const newSpot = await dispatch(
          createSpot(
            formData,
            imageUrls.filter((url) => url.trim() !== "")
          )
        );
        setSuccessMessage("Spot created successfully!");
        setTimeout(() => {
          navigate(`/spots/${newSpot.id}`);
        }, 2000);
      } catch (err) {
        if (err.errors) {
          setErrors(err.errors);
        } else {
          setErrors({ general: "An error occurred. Please try again." });
        }
      }
    }
  };

  return (
    <div className="create-spot-form">
      <h1>Create a New Spot</h1>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where's your place located?</h2>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <label>
            Country
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </label>
          {errors.country && <div className="error">{errors.country}</div>}
          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </label>
          {errors.address && <div className="error">{errors.address}</div>}
          <label>
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </label>
          {errors.city && <div className="error">{errors.city}</div>}
          <label>
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </label>
          {errors.state && <div className="error">{errors.state}</div>}
        </section>
        <section>
          <h2>Tell us about your place</h2>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          {errors.description && (
            <div className="error">{errors.description}</div>
          )}
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          {errors.name && <div className="error">{errors.name}</div>}
          <label>
            Price (per night)
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          {errors.price && <div className="error">{errors.price}</div>}
        </section>
        <section>
          <h2>Add some photos</h2>
          {imageUrls.map((url, index) => (
            <label key={index}>
              Image URL {index + 1}
              <input
                type="text"
                value={url}
                onChange={(e) => handleImageChange(index, e.target.value)}
                required={index === 0}
              />
            </label>
          ))}
          {errors.images && <div className="error">{errors.images}</div>}
          {Object.keys(errors)
            .filter((key) => key.startsWith("imageUrl"))
            .map((key, index) => (
              <div key={index} className="error">
                {errors[key]}
              </div>
            ))}
        </section>
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;
