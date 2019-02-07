import { createAction, createThunkAction } from 'redux-tools';
import { Deserializer } from 'jsonapi-serializer';
import sortBy from 'lodash/sortBy';

// services
import { fetchPartners } from 'services/PartnersService';

// Actions
export const setPartners = createAction('FOOTER_SET_PARTNERS');
export const setPartnersLoading = createAction('FOOTER_SET_PARTNERS_LOADING');
export const setPartnersError = createAction('FOOTER_SET_PARTNERS_ERROR');

// Async actions
export const getPublishedPartners = createThunkAction('FOOTER_FETCH_PARTNERS',
  () => (dispatch) => {
    dispatch(setPartnersLoading(true));
    dispatch(setPartnersError(null));

    return fetchPartners({ published: true })
      .then((partners) => {
        dispatch(setPartnersLoading(false));
        dispatch(setPartnersError(null));

        dispatch(setPartners(sortBy(partners.filter(p => p.featured), 'name')));
      })
      .catch((err) => {
        dispatch(setPartnersLoading(false));
        dispatch(setPartnersError(err));
      });
  });
