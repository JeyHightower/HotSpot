import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session'; 
import spotsReducer from "./spots"
import reviewsReducer from "./reviews"

// Combine reducers for your application
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotsReducer,
  reviews: reviewsReducer

 
});

// Configure store enhancer (middleware and devtools)
let enhancer;

if (import.meta.env.MODE === 'production') {
  // In production, only apply thunk middleware
  enhancer = applyMiddleware(thunk);
} else {
  // In development, include redux-logger and devtools
  const logger = (await import('redux-logger')).default;
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// Create and configure the Redux store
const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;