import { csrfFetch } from "./csrf";

// Action Types
const SET_USER_REVIEWS = "reviews/SET_USER_REVIEWS";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const SET_REVIEW_ERRORS = "reviews/SET_REVIEW_ERRORS";
const SET_SPOT_REVIEWS = "reviews/SET_SPOT_REVIEWS";

// Action Creators
export const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  payload: reviews,
});

export const removeReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

export const setReviewErrors = (errors) => ({
  type: SET_REVIEW_ERRORS,
  payload: errors,
});

export const setSpotReviews = (reviews) => ({
  type: SET_SPOT_REVIEWS,
  payload: reviews,
});

// Thunks
export const createReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();
      dispatch({ type: CREATE_REVIEW, payload: newReview });
      return newReview;
    } else {
      const errorData = await response.json();
      if (errorData.errors) {
        dispatch(setReviewErrors(errorData.errors));
      }
      throw errorData;
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(removeReview(reviewId));
    } else {
      const errors = await response.json();
      console.error("Error deleting review:", errors);
    }
  } catch (error) {
    console.error("Error deleting review:", error);
  }
};

export const fetchUserReviews = () => async (dispatch) => {
  const response = await csrfFetch("/api/reviews/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(setUserReviews(data.Reviews));
    return data.Reviews;
  } else {
    const errors = await response.json();
    console.error("Error fetching user reviews:", errors);
    return errors;
  }
};

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    
    if (response.ok) {
      const data = await response.json();
      dispatch(setSpotReviews(data.Reviews));
      return data.Reviews;
    } else {
      const errors = await response.json();
      console.error("Error fetching spot reviews:", errors);
      return errors;
    }
  } catch (error) {
    console.error("Error fetching spot reviews:", error);
    throw error;
  }
};

// Initial State
const initialState = {
  userReviews: [],
  spotReviews: [],
  reviewErrors: null,
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW:
      return {
        ...state,
        userReviews: [action.payload, ...state.userReviews],
        spotReviews: [action .payload, ...state.spotReviews],
        reviewErrors: null,
      };
    case SET_REVIEW_ERRORS:
      return { ...state, reviewErrors: action.payload };
    case DELETE_REVIEW:
      return {
        ...state,
        userReviews: state.userReviews.filter(
          (review) => review.id !== action.payload
        ),
        spotReviews: state.spotReviews.filter(
          (review) => review.id !== action.payload
        ),
      };
    case SET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };
    case SET_SPOT_REVIEWS:
      return { ...state, spotReviews: action.payload };
    default:
      return state;
  }
};

export default reviewsReducer;