// EditSpotForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateSpot, fetchSpotDetails } from '../../store/spots';

const EditSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots.singleSpot);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
    previewImage: '',
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setFormData({
        address: spot.address || '',
        city: spot.city || '',
        state: spot.state || '',
        country: spot.country || '',
        lat: spot.lat || '',
        lng: spot.lng || '',
        name: spot.name || '',
        description: spot.description || '',
        price: spot.price || '',
        previewImage: spot.previewImage || '',
        image1: spot.otherImages && spot.otherImages[0] ? spot.otherImages[0].url : '',
        image2: spot.otherImages && spot.otherImages[1] ? spot.otherImages[1].url : '',
        image3: spot.otherImages && spot.otherImages[2] ? spot.otherImages[2].url : '',
        image4: spot.otherImages && spot.otherImages[3] ? spot.otherImages[3].url : ''
      });
    }
  }, [spot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const updatedSpot = await dispatch(updateSpot(spotId, formData));
      if (updatedSpot && updatedSpot.id) {
        navigate(`/spots/${updatedSpot.id}`);
      } else {
        setErrors({ form: 'Failed to update spot. Please try again.' });
      }
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ form: error.toString() });
      }
    }
  };

  return (
    <div>
      <h1>Update your Spot</h1>
      {errors.form && <p className="error">{errors.form}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}

        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        {errors.city && <p className="error">{errors.city}</p>}

        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        {errors.state && <p className="error">{errors.state}</p>}

        <input
          type="text" name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        {errors.country && <p className="error">{errors.country}</p>}

        <input
          type="number"
          name="lat"
          value={formData.lat}
          onChange={handleChange}
          placeholder="Latitude"
          required
        />
        {errors.lat && <p className="error">{errors.lat}</p>}

        <input
          type="number"
          name="lng"
          value={formData.lng}
          onChange={handleChange}
          placeholder="Longitude"
          required
        />
        {errors.lng && <p className="error">{errors.lng}</p>}

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        {errors.description && <p className="error">{errors.description}</p>}

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        {errors.price && <p className="error">{errors.price}</p>}

        <input
          type="text"
          name="previewImage"
          value={formData.previewImage || ''}
          onChange={handleChange}
          placeholder="Preview Image URL (optional)"
        />
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}

        <input
          type="text"
          name="image1"
          value={formData.image1 || ''}
          onChange={handleChange}
          placeholder="Image URL 1 (optional)"
        />
        {errors.image1 && <p className="error">{errors.image1}</p>}

        <input
          type="text"
          name="image2"
          value={formData.image2 || ''}
          onChange={handleChange}
          placeholder="Image URL 2 (optional)"
        />
        {errors.image2 && <p className="error">{errors.image2}</p>}

        <input
          type="text"
          name="image3"
          value={formData.image3 || ''}
          onChange={handleChange}
          placeholder="Image URL 3 (optional)"
        />
        {errors.image3 && <p className="error">{errors.image3}</p>}

        <input
          type="text"
          name="image4"
          value={formData.image4 || ''}
          onChange={handleChange}
          placeholder="Image URL 4 (optional)"
        />
        {errors.image4 && <p className="error">{errors.image4}</p>}

        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default EditSpotForm;