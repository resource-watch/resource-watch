import * as actions from './explore-actions';

export default {
  //
  // DATASET
  //
  [actions.setDatasets]: (state, action) => {
    const datasets = { ...state.datasets, list: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsLoading]: (state, action) => {
    const datasets = { ...state.datasets, loading: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsError]: (state, action) => {
    const datasets = { ...state.datasets, error: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsPage]: (state, action) => {
    const datasets = { ...state.datasets, page: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsTotal]: (state, action) => {
    const datasets = { ...state.datasets, total: action.payload };
    return { ...state, datasets };
  },
  [actions.setDatasetsLimit]: (state, action) => {
    const datasets = { ...state.datasets, limit: action.payload };
    return { ...state, datasets };
  },


  //
  // SIDEBAR
  //
  [actions.setSidebarOpen]: (state, action) => {
    const sidebar = { ...state.sidebar, open: action.payload };
    return { ...state, sidebar };
  }
};
