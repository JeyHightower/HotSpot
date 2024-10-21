// EditSpotForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSpot } from '../../store/spots'; // You'll need to create this action

const EditSpotForm = ({ spot, onClose }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    name: spot.name,
    description: spot.description,
    price: spot.price
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateSpot(spot.id, formData));
    if (result) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <input
        type="text"
        name="city"
        value={formData.city}
        onChange={handleChange}
        placeholder="City"
        required
      />
      <input
        type="text"
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="State"
        required
      />
      <input
        type="text"
        name="country"
        value={formData.country}
        onChange={handleChange}
        placeholder="Country"
        required
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price"
        required
      />
      <button type="submit">Update Spot</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
};

export default EditSpotForm;