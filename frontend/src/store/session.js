import { csrfFetch } from './csrf';

//contain all actions specific to the sessions user's info and session users redux reducers

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
    user: null,
};

const sessionReducer = (state = initialState, action) =>{
    switch(action.type) {
        case SET_USER:
            return { ...state, user: {
                id: action.user.id,
                email: action.user.email,
                username: action.user.username,
                firstName: action.user.firstName,
                lastName: action.user.lastName,
            }};
            case REMOVE_USER:
                return { ...state, user: null };
                default:
                    return state;
    }
};

//thunk for login
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
    dispatch(setUser (data.user));
    return response;
};


//Thunk for restore Session
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

export default sessionReducer;