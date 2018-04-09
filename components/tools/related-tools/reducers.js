import * as actions from './actions';

export default {
  //
  // TOOLS
  //
  [actions.setTools]: (state, action) => ({ ...state, list: action.payload }),
  [actions.setActiveTools]: (state, action) => ({ ...state, active: action.payload }),
  [actions.setToolsLoading]: (state, action) => ({ ...state, loading: action.payload }),
  [actions.setToolsError]: (state, action) => ({ ...state, error: action.payload })
};
