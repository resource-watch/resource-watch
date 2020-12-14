import {
  addToLoadingQueue,
  removeToLoadingQueue,
} from './actions';

export default (state, action) => {
  switch (action.type) {
    case addToLoadingQueue:
      return ([
        ...[...state],
        action.payload,
      ]);
    case removeToLoadingQueue:
      return state.filter((collectionId) => collectionId !== action.payload);
    default:
      throw new Error();
  }
};
