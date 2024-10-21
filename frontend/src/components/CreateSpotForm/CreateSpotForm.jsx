// src/components/CreateSpotForm/CreateSpotForm.jsx

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // Reset form when navigating away and back
    return () => {
      setFormData({
        country: "",
        address: "",
        city: "",
        state: "",
        description: "",
        name: "",
        price: "",
      });
      setImageUrls(["", "", "", "", ""]);
      setErrors({});
      setSuccessMessage("");
    };
  }, []);

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
      newErrors.description = "Description needs 30 or more characters";
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price per night is required";

    if (!imageUrls[0].trim())
      newErrors.previewImage = "Preview Image URL is required";

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
        navigate(`/spots/${newSpot.id}`);
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
      {Object.values(errors).length > 0 && (
        <div className="error-summary">
          {Object.values(errors).map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
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
              placeholder="Country"
            />
            {errors.country && <p>{errors.country}</p>}
          </label>
          <label>
            Address
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            {errors.address && <p>{errors.address}</p>}
          </label>
          <label>
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <p>{errors.city}</p>}
          </label>
          <label>
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            {errors.state && <p>{errors.state}</p>}
          </label>
        </section>
        <section>
          <h2>Tell guests about your place</h2>
          <p>
            Write a description that highlights what makes your place special.
          </p>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            {errors.description && <p>{errors.description}</p>}
          </label>
        </section>
        <section>
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name of your spot"
            />
            {errors.name && <p>{errors.name}</p>}
          </label>
        </section>
        <section>
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <label>
            Price per night (USD)
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per night (USD)"
            />
            {errors.price && <p>{errors.price}</p>}
          </label>
        </section>
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {imageUrls.map((imageUrl, index) => (
            <label key={index}>
              {index === 0 ? "Preview Image URL" : "Image URL"}
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder={index === 0 ? "Preview Image URL" : "Image URL"}
              />
              {errors.previewImage && index === 0 && (
                <p>{errors.previewImage}</p>
              )}
            </label>
          ))}
        </section>
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;
