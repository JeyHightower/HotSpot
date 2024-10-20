import React from "react";
import "./StarRating.css";

const StarRating = ({ rating, onRatingChange }) => {
  //function to create an array of 5 elements

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "star filled" : "star"} //Apply 'filled' class if the star is filled
          onClick={() => onRatingChange(i)}
          //Call onRatingChange w/selected rating
        >
          ★
        </span>
      );
    }
    return stars;
  };
  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
