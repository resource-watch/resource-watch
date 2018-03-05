import * as actions from './data-actions';

export default {
  [actions.setActiveTab]: (state, action) =>
    ({ ...state, tab: action.payload }),
  [actions.setPageParams]: (state, action) => ({ ...state, ...action.payload }),
  [actions.changeDatasetPage]: (state, action) => {
    const datasets = Object.assign({}, state.datasets, { activePage: action.payload });
    return Object.assign({}, state, { datasets });
  },
  [actions.setDatasets]: (state, action) => {
    return Object.assign({}, state, { datasets: action.payload });
  },
  [actions.setWidgets]: (state, action) => ({ ...state, widgets: action.payload }),
  [actions.setPagination]: (state, action) => ({ ...state, pagination: action.payload })
};
