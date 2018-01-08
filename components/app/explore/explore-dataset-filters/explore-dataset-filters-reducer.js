import { deselectAllElementsFromTree } from 'utils/explore/TreeUtil';
import * as actions from './explore-dataset-filters-actions';

export const initialState = {
  data: {},
  filters: {}
};

// NOTE: We're temporarily hiding the geographies filter
export default {
  [actions.setDataFilters]: (state, { payload }) => ({ ...state, data: payload }),
  [actions.setFilters]: (state, { payload }) =>
    ({ ...state, filters: { ...state.filters, ...payload } }),
  [actions.clearFilters]: (state) => {
    Object.keys(state.data).forEach(key =>
      state.data[key].forEach(tree => deselectAllElementsFromTree(tree)));
    return { ...state, filters: {} };
  },
  [actions.removeTagFilter]: (state, { payload }) => {
    if (payload.labels.includes('TOPIC')) {
      const newTopics = state.filters.topics;
      newTopics.splice(newTopics.indexOf(payload.value), 1);
      return { ...state, filters: Object.assign({}, ...state.filters, { topics: newTopics }) };
    // } else if (payload.labels.includes('GEOGRAPHY')) {
    //   const newGeographies = state.filters.geographies;
    //   newGeographies.splice(newGeographies.indexOf(payload.value), 1);
    //   return { ...state, filters: Object.assign({}, ...state.filters,
    // { topics: newGeographies }) };
    } else if (payload.labels.includes('DATA_TYPE')) {
      const newDataTypes = state.filters.dataTypes;
      newDataTypes.splice(newDataTypes.indexOf(payload.value), 1);
      return { ...state, filters: Object.assign({}, ...state.filters, { topics: newDataTypes }) };
    } else { // eslint-disable-line no-else-return
      return state;
    }
  }
};
