import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as reducers from 'redactions';


const emptyState = {};

/**
 * Reducers
 * @info(http://redux.js.org/docs/basics/Reducers.html)
 * @type {Object}
 */
const reducer = combineReducers({
  ...reducers
});

export const initStore = (initialState = emptyState) => {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware));
}
