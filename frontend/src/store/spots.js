import { csrfFetch } from "./csrf";

/* 
  Action Types:
  - SET_SPOT_DETAILS: Used to set the details of a specific spot.
  - SET_SPOTS: Used to set an array of all spots.
*/
const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";
const SET_SPOTS = "spots/SET_SPOTS";

// Action Creators 
export const setSpotDetails = (spot) => ({
  type: SET_SPOT_DETAILS,
  payload: spot,
});

export const setSpots = (spots) => ({
  type: SET_SPOTS,
  payload: spots,
});

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

// Reducer 
const initialState = {};

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPOT_DETAILS:
      return { ...state, [action.payload.id]: action.payload };
    case SET_SPOTS:
      return action.payload;
    default:
      return state;
  }
};

export default spotReducer;