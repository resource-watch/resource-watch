import * as actions from './actions';

export default {
  [actions.setMobileOpened]: (state, action) => ({ ...state, mobileOpened: action.payload }),
  [actions.setDropdownOpened]: (state, action) => ({
    ...state,
    dropdownOpened: {
      ...{
        data: false, about: false, myrw: false, dashboards: false, get_involved: false,
      },
      ...action.payload,
    },
  }),
  [actions.setSearchOpened]: (state, action) => ({ ...state, searchOpened: action.payload }),
  [actions.setSearchTerm]: (state, action) => ({ ...state, searchTerm: action.payload }),
};
