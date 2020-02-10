import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import injectRedux from './inject_redux';

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const rootReducer = combineReducers({});

const withRedux = injectRedux(({ initialState = {}, ...props }) => {
  return createStore(rootReducer, initialState, composeEnhancers());
});

export default withRedux;
