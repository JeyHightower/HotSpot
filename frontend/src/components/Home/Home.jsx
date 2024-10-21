import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpots } from "../../store/spots";
import { Link } from 'react-router-dom';
import './Home.css';

const randomLocations = [
  { city: "New York", state: "NY", price: 150 },
  { city: "Los Angeles", state: "CA", price: 200 },
  { city: "Chicago", state: "IL", price: 120 },
  { city: "Houston", state: "TX", price: 100 },
  { city: "Phoenix", state: "AZ", price: 90 },
  { city: "Philadelphia", state: "PA", price: 110 },
  { city: "San Antonio", state: "TX", price: 95 },
  { city: "San Diego", state: "CA", price: 180 },
  { city: "Dallas", state: "TX", price: 130 },
  { city: "San Jose", state: "CA", price: 170 }
];

const imageUrls = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c? ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
];

function Home() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.allSpots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const getAverageRating = (spot) => {
    if (!spot.avgRating || spot.avgRating === 0) return "New";
    return spot.avgRating.toFixed(1);
  };

  return (
    <div className="home-container">
      {randomLocations.map((location, index) => (
        <Link to={`/spots/${location.city.toLowerCase()}`} key={index} className="spot-link">
          <div className="spot-tile" title={location.city}>
            <img src={imageUrls[index]} alt={location.city} className="spot-image" />
            <div className="spot-info">
              <div className="spot-location">{location.city}, {location.state}</div>
              <div className="spot-rating">
                <span className="star">★</span> {getAverageRating({ avgRating: Math.random() * 5 })}
              </div>
              <div className="spot-price">${location.price} <span className="night">night</span></div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Home;