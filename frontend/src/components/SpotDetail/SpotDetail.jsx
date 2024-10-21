import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotDetails } from '../../store/spots';
import { fetchSpotReviews } from '../../store/reviews';
import { FaStar } from 'react-icons/fa';
import './SpotDetail.css';

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => state.reviews.spotReviews);
  const isLoading = useSelector(state => state.spots.isLoading);
  const error = useSelector(state => state.spots.error);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchSpotReviews(spotId));
  }, [dispatch, spotId]);

  const handleReserve = () => {
    alert("Feature coming soon");
  };

  const renderRatingInfo = () => {
    if (!spot) return null;

    if (spot.numReviews === 0) {
      return (
        <>
          <FaStar /> New
        </>
      );
    } else {
      return (
        <>
          <FaStar /> 
          {spot.avgRating ? spot.avgRating.toFixed(1) : 'N/A'}
          <span className="centered-dot"> · </span>
          {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
        </>
      );
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="spot-detail">
      {spot ? (
        <>
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
              <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
              <p>{spot.description}</p>
            </div>
            
            <div className="callout-box">
              <p><span className="price">${spot.price}</span> night</p>
              <p className="rating">
                {renderRatingInfo()}
              </p>
              <button onClick={handleReserve}>Reserve</button>
            </div>
          </div>

          <div className="reviews-section">
            <h2>
              {renderRatingInfo()}
            </h2>
            
            {reviews && reviews.map(review => (
              <div key={review.id} className="review">
                <p>{review.User.firstName}</p>
                <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p>{review.review}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SpotDetail;