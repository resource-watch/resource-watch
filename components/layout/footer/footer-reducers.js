import * as actions from './footer-actions';

export default {
  [actions.setPartners]: (state, action) =>
    ({ ...state, partners: action.payload })
};
