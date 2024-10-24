import { csrfFetch } from "./csrf";
import {
  CREATE_SPOT,
  SET_SPOT_ERRORS,
  SET_SPOT_DETAILS,
  SET_SPOTS,
  DELETE_SPOT,
  UPDATE_SPOT,
  SET_LOADING,
  SET_ERROR,
  SET_RANDOM_SPOTS,
  UPDATE_SPOT_START,
  UPDATE_SPOT_SUCCESS,
  UPDATE_SPOT_FAILURE,
  LOAD_USER_SPOTS,
} from "./spotConstants";

// Sample random locations and image URLs
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
  { city: "San Jose", state: "CA", price: 170 },
];

const imageUrls = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwaG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80",
  "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  " https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3& ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGhvdXNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
];

// Action Creators
export const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

export const setRandomSpots = (spots) => ({
  type: SET_RANDOM_SPOTS,
  payload: spots,
});

export const generateRandomSpots = () => (dispatch) => {
  const randomSpots = randomLocations.map((location, index) => ({
    id: index + 1,
    name: `Spot in ${location.city}, ${location.state}`,
    previewImage: imageUrls[Math.floor(Math.random() * imageUrls.length)],
    city: location.city,
    state: location.state,
    avgRating: Math.random() * 5,
    price: location.price,
  }));

  dispatch(setRandomSpots(randomSpots));
};

export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

export const setSpotErrors = (errors) => ({
  type: SET_SPOT_ERRORS,
  payload: errors,
});

export const removeSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

export const setUpdatedSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const updateSpotStart = () => ({
  type: UPDATE_SPOT_START,
});

export const updateSpotSuccess = (spot) => ({
  type: UPDATE_SPOT_SUCCESS,
  payload: spot,
});

export const updateSpotFailure = (error) => ({
  type: UPDATE_SPOT_FAILURE,
  payload: error,
});

export const loadUserSpots = (spots) => ({
  type: LOAD_USER_SPOTS,
  payload: spots,
});

// Thunks

export const fetchUserSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots/current");
  if (response.ok) {
    const spots = await response.json();
    dispatch(loadUserSpots(spots));
  }
};
export const updateSpot = (spotId, spotData, imageUrls) => async (dispatch) => {
  dispatch(updateSpotStart());
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(updateSpotSuccess(updatedSpot));

      if (imageUrls && imageUrls.length > 0) {
        for (let i = 0; i < imageUrls.length; i++) {
          if (imageUrls[i]) {
            await csrfFetch(`/api/spots/${spotId}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: imageUrls[i], preview: i === 0 }),
            });
          }
        }
      }
      return updatedSpot;
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        dispatch(setSpotErrors(errorData.errors));
      }
      dispatch(updateSpotFailure(errorData));
      throw errorData;
    }
  } catch (error) {
    console.error("Error updating spot:", error);
    dispatch(updateSpotFailure(error.toString()));
    throw error;
  }
};

export const createSpot = (spotData, imageUrls) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const createdSpot = await response.json();
      dispatch({ type: CREATE_SPOT, payload: createdSpot });

      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i]) {
          await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imageUrls[i], preview: i === 0 }),
          });
        }
      }

      return createdSpot;
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        dispatch(setSpotErrors(errorData.errors));
      }
      throw errorData;
    }
  } catch (error) {
    console.error("Error creating spot :", error);
    throw error;
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spotData = await response.json();
      dispatch(setSpotDetails(spotData));
    } else {
      const error = await response.json();
      dispatch(setError(error.message || "Failed to fetch spot details"));
    }
  } catch (error) {
    console.error("Error fetching spot details:", error);
    dispatch(setError(error.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchSpots = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch("/api/spots");
    if (!response.ok) {
      throw new Error("Failed to fetch spots");
    }
    const data = await response.json();
    console.log("Fetched spots:", data);
    dispatch(setSpots(data));
  } catch (error) {
    console.error("Error fetching spots:", error);
    dispatch(setError(error.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(removeSpot(spotId));
      dispatch(fetchUserSpots()); // Fetch updated user spots
    } else {
      const errorData = await response.json();
      console.error("Error deleting spot:", errorData);
    }
  } catch (error) {
    console.error("Error deleting spot:", error);
  }
};

// Reducer
const initialState = {
  allSpots: {},
  singleSpot: null,
  isLoading: false,
  error: null,
  randomSpots: [],
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
        singleSpot: action.payload,
      };

    case SET_SPOT_DETAILS:
      return { ...state, singleSpot: action.payload, error: null };

    case SET_SPOTS:
      return { ...state, allSpots: action.payload };

    case UPDATE_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
        singleSpot: action.payload,
      };

    case DELETE_SPOT:
      const newAllSpots = { ...state.allSpots };
      delete newAllSpots[action.payload];
      return {
        ...state,
        allSpots: newAllSpots,
        singleSpot: null,
        userSpots: state.userSpots ? state.userSpots.filter(spot => spot.id !== action.payload) : null,
      };
      
      case LOAD_USER_SPOTS:
        return { ...state, userSpots: action.payload };

    case SET_SPOT_ERRORS:
      return { ...state, errors: action.payload };

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    case SET_RANDOM_SPOTS:
      return { ...state, randomSpots: action.payload };

    case UPDATE_SPOT_START:
      return { ...state, isLoading: true, error: null };

    case UPDATE_SPOT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
        singleSpot: action.payload,
      };

    case UPDATE_SPOT_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    case LOAD_USER_SPOTS:
      return { ...state, userSpots: action.payload };

    default:
      return state;
  }
};

export default spotReducer;
