import { React, useState, useEffect } from "react";
import { csrfFetch } from "../../store/csrf";
import SpotCard from "../SpotCard/SpotCard";
import "./Homepage.css";

function HomePage() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //! useEffect to fetch all spots data

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await csrfFetch("/api/spots");

        if (!response.ok) {
          throw new Error("Failed to fetch spots");
        }
        const data = await response.json();
        //! assuming backend returns spots in a spots array
        setSpots(data.Spots);
      } catch (error) {
        console.error("error Fetching spots:", error);
        setError("Oops, something went wrong! Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="home-page-container">
      <h1>All Spots</h1>
      {isLoading && <div>Loading spots...</div>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && (
        <ul className="spot-list">
          {spots.map((spot) => (
            <li key={spot.id}>
              <SpotCard spot={spot} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
