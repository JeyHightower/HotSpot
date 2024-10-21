import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import './SpotDetail.css';

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const isLoading = useSelector(state => state.spots.isLoading);
  const error = useSelector(state => state.spots.error);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!spot) return null;

  const handleReserve = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>{spot.city}, {spot.state}, {spot.country}</p>
      
      <div className="image-gallery">
        {spot.SpotImages && spot.SpotImages.length > 0 && (
          <>
            <img className="large-image" src={spot.SpotImages[0].url} alt="Main spot" />
            <div className="small-images">
              {spot.SpotImages.slice(1, 5).map((image, index) => (
                <img key={index} src={image.url} alt={`Spot ${index + 1}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="spot-info">
        <div className="host-description">
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
        </div>
        
        <div className="callout-box">
          <p><span className="price">${spot.price}</span> night</p>
          <button onClick={handleReserve}>Reserve</button>
        </div>
      </div>
    </div>
  );
};

export default SpotDetail;