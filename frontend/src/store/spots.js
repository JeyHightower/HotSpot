import { csrfFetch } from "./csrf";
import { CREATE_SPOT, SET_SPOT_ERRORS } from "./spotConstants";

// Action Types
const SET_SPOT_DETAILS = "spots/SET_SPOT_DETAILS";
const SET_SPOTS = "spots/SET_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const SET_LOADING = "spots/SET_LOADING";
const SET_ERROR = "spots/SET_ERROR";

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

// Thunks
export const updateSpot = (spotId, spotData, imageUrls) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });
    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(setUpdatedSpot(updatedSpot));

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
      throw errorData;
    }
  } catch (error) {
    console.error("Error updating spot:", error);
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
    console.error("Error creating spot:", error);
    throw error;
  }
};

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
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch("/api/spots");
    if (!response.ok) {
      throw new Error('Failed to fetch spots');
    }
    const data = await response.json();
    console.log('Fetched spots:', data);
    dispatch(setSpots(data));
  } catch (error) {
    console.error('Error fetching spots:', error);
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

    case UPDATE_SPOT: {
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.payload.id]: action.payload },
        singleSpot: action.payload,
      };
    }

    case SET_SPOT_ERRORS:
      return { ...state, error: action.payload };

    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.allSpots[action.payload];
      return newState;
    }

    case SET_LOADING:
      return { ...state, isLoading: action.payload };

    case SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default spotReducer;