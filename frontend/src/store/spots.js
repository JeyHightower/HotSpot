import { csrfFetch } from "./csrf";
import { CREATE_SPOT, SET_SPOT_ERRORS } from "./spotConstants";

/* 
  Action Types:
  - SET_SPOT_DETAILS: Used to set the details of a specific spot.
  - SET_SPOTS: Used to set an array of all spots.
  - CREATE_SPOT: Used to add a newly created spot to the Redux store.
  - SET_SPOT_ERRORS: Used to set validation errors for spot creation. 
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

// Action creator to set spot errors
export const setSpotErrors = (errors) => ({
  type: SET_SPOT_ERRORS,
  payload: errors,
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

      // Dispatch the CREATE_SPOT action to add the new spot to the Redux store
      dispatch({ type: CREATE_SPOT, payload: createdSpot });

      // Upload images separately to the backend (if necessary)
      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i]) {
          await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imageUrls[i], preview: i === 0 }),
          });
        }
      }

      return createdSpot; // Return the created spot for potential use in the component
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        // Dispatch the SET_SPOT_ERRORS action if the backend returns validation errors
        dispatch(setSpotErrors(errorData.errors));
      }
      // Re-throw the error so it can be handled in the component
      throw errorData;
    }
  } catch (error) {
    console.error("Error creating spot:", error);
    throw error; // Re-throw for component-level error handling
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
      const normalizedSpots = action.payload.reduce((acc, spot) => {
        acc[spot.id] = spot;
        return acc;
      }, {});
      return { ...state, allSpots: normalizedSpots };
    case SET_SPOT_ERRORS:
      return { ...state, errors: action.payload };
    default:
      return state;
  }
};

export default spotReducer;
