import { csrfFetch } from "./csrf";

const SET_USER_REVIEWS = "reviews/SET_USER_REVIEWS";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

//Action creator to set user reviews
export const setUserReviews = (reviews) => ({
  type: SET_USER_REVIEWS,
  payload: reviews,
});

//action creator for delete review;
export const removeReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

//thunk to delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      // Replace with your actual API endpoint
      method: "DELETE",
    });

    if (response.ok) {
      // Dispatch the removeReview action to update the Redux store
      dispatch(removeReview(reviewId));
    } else {
      // Handle errors if the fetch is not successful
      const errors = await response.json();
      console.error("Error deleting review:", errors);
      // Consider displaying error messages to the user or handling errors differently
    }
  } catch (error) {
    console.error("Error deleting review:", error);
  }
};

// Thunk to fetch user reviews for current user

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

//Reducer for Reviews

const initialState = {
  userReviews: [],
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REVIEW:
      // Return a new state with the deleted review removed from userReviews
      return {
        ...state,
        userReviews: state.userReviews.filter(
          (review) => review.id !== action.payload
        ),
      };
    case SET_USER_REVIEWS:
      return { ...state, userReviews: action.payload };
    default:
      return state;
  }
};

export default reviewsReducer;
