import { csrfFetch } from  './csrf';

//Action creator to set user reviews

const SET_USER_REVIEWS = 'reviews/SET_USER_REVIEWS';

export const setUserReviews = (reviews) => ({
    type: SET_USER_REVIEWS,
    payload: reviews,
});

// Thunk to fetch user reviews for current user

export const fetchUserReviews = () => async (dispatch) => {
    const response = await csrfFetch('/api/reviews/current');

    if(response.ok) {
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
    userReviews: []
};

const reviewsReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER_REVIEWS:
            return {...state, userReviews: action.payload};
        default:
            return state;
    }
};

export default reviewsReducer;