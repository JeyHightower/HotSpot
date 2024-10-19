import { csrfFetch } from "./csrf";
import { CREATE_SPOT, SET_SPOT_ERRORS } from "./spotConstants";

/* 
  Action Types:
  - SET_SPOT_DETAILS: Used to set the details of a specific spot.
  - SET_SPOTS: Used to set an array of all spots.
  - CREATE_SPOT: Used to add a newly created spot to the Redux store.
  - SET_SPOT_ERRORS: Used to set validation errors for spot creation. 
  - DELETE_SPOT: Used to remove a spot from the Redux store.
*/
const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";
const SET_SPOTS = "spots/SET_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";

// Action Creators
export const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

export const setSpotErrors = (errors) => ({
  type: SET_SPOT_ERRORS,
  payload: errors,
});

// Action creator for deleting a spot
export const removeSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

// Thunk to create a new spot
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

      // If you need to upload images separately to your backend:
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
    console.error("Error creating spot:", error);
    throw error;
  }
};

// Thunk to fetch spot details
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spotData = await response.json();
    dispatch(setSpotDetails(spotData));
  } else {
    const error = await response.json();
    return error;
  }
};

export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    dispatch(setSpots(data.Spots));
  }
};

// Thunk to delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(removeSpot(spotId));
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
  errors: null,
};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
      };

    case SET_SPOT_DETAILS:
      return { ...state, singleSpot: action.payload };

    case SET_SPOTS:
      return { ...state, allSpots: action.payload };

    case SET_SPOT_ERRORS:
      return { ...state, errors: action.payload };

    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.payload];
      return newState;
    }

    default:
      return state;
  }
};

export default spotReducer;
