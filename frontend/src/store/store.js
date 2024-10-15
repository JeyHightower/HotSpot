import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';

//create a rootReducer that calls combineReducers and passes in empty obj.
const rootReducer = combineReducers({
    session: sessionReducer,
});

//init enhancer variable
let enhancer;

//enhancer will be set to diff store enhancers depending
//on whether the Node env is development or production
if (import.meta.env.MODE === "production") {
  enhancer == applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
