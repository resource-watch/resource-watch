import * as actions from './footer-actions';

export default {
  [actions.setPartners]: (state, action) => {
    const partners = {
      ...state.partners,
      ...{
        list: action.payload,
        loading: false,
        error: null
      }
    };

    return { ...state, partners };
  },
  [actions.setPartnersLoading]: (state) => {
    const partners = {
      ...state.partners,
      ...{
        loading: true,
        error: null
      }
    };

    return { ...state, partners };
  },
  [actions.setPartnersError]: (state, action) => {
    const partners = {
      ...state.partners,
      ...{
        loading: false,
        error: action.payload
      }
    };

    return { ...state, partners };
  }
};
