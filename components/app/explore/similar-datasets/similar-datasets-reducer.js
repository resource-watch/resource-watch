import * as actions from './similar-datasets-actions';

export const initialState = {
  similarDatasets: {
    data: [], // Similar datasets
    loading: true, // Are we loading the data?
    error: null // An error was produced while loading the data
  }
};

export default {
  [actions.getSimilarDatasetsLoading]: (state) => {
    const similarDatasets = {
      loading: true,
      error: null
    };
    const newSimilarDatasets = Object.assign({}, state.similarDatasets, similarDatasets);
    return Object.assign(state, { similarDatasets: newSimilarDatasets });
  },
  [actions.getSimilarDatasetsError]: (state, { payload }) => {
    const similarDatasets = {
      loading: false,
      error: payload
    };
    const newSimilarDatasets = Object.assign({}, state.similarDatasets, similarDatasets);
    return Object.assign(state, { similarDatasets: newSimilarDatasets });
  },
  [actions.getSimilarDatasetsSuccess]: (state) => {
    const similarDatasets = {
      loading: false,
      error: null
    };
    const newSimilarDatasets = Object.assign({}, state.similarDatasets, similarDatasets);
    return Object.assign(state, { similarDatasets: newSimilarDatasets });
  },
  [actions.setSimilarDatasets]: (state) => {
    const similarDatasets = {
      data: payload
    };
    const newSimilarDatasets = Object.assign({}, state.similarDatasets, similarDatasets);
    return Object.assign(state, { similarDatasets: newSimilarDatasets });
  }
};
