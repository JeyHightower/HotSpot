//contain all actions specific to the sessions user's info and session users redux reducers
import { csrfFetch } from './csrf.js';


//define action types
const SET_USER = 'SET_USER';
const REMOVE_USER = 'REMOVE_USER';


//action creators
export const setUser = (user) => {
    return  {
        type: SET_USER,
        payload: user
}
};

export const removeUser = () => {
    return {
    type: REMOVE_USER
}};

//Session Reducer
const initialState = {
    user: null
};

const sessionReducer = (state = initialState, action) =>{
    switch(action.type) {
        case SET_USER:
            return { ...state, user: action.payload };
            case REMOVE_USER:
                return { ...state, user: null };
                default:
                    return state;
    }
};

//Login Thunk

export const login = (user) => async (dispatch) => {
   const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};


//restore User Thunk

export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//Signup Thunk

export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            password
        })
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};


//Logout Thunk

export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    })
    dispatch(removeUser());
    return response;
};



export default sessionReducer ;