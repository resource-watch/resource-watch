import * as actions from './data-actions';

export default {
  [actions.toggleLoading]: state => ({ ...state, loading: !state.loading }),
  [actions.setActiveTab]: (state, action) =>
    ({ ...state, tab: action.payload }),
  [actions.setPageParams]: (state, action) => ({ ...state, ...action.payload }),
  [actions.changeDatasetPage]: (state, action) => {
    const datasets = Object.assign({}, state.datasets, {
      activePage: action.payload + 1, offset: action.payload * state.datasets.pagination.size });
    return Object.assign({}, state, { datasets });
  },
  [actions.setDatasets]: (state, action) => {
    const { list, pagination, page } = action.payload;
    const datasets = Object.assign({}, state.datasets, {
      list, pagination, activePage: page || state.datasets.activePage });
    return Object.assign({}, state, { datasets });
  },
  [actions.setWidgets]: (state, action) => ({ ...state, widgets: action.payload }),
  [actions.setPagination]: (state, action) => ({ ...state, pagination: action.payload })
};
