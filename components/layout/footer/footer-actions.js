import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';
import { Deserializer } from 'jsonapi-serializer';
import sortBy from 'lodash/sortBy';

// Actions
export const setPartners = createAction('FOOTER_SET_PARTNERS');
export const setPartnersLoading = createAction('FOOTER_SET_PARTNERS_LOADING');
export const setPartnersError = createAction('FOOTER_SET_PARTNERS_ERROR');

// Async actions
export const fetchPartners = createThunkAction('FOOTER_FETCH_PARTNERS', () => (dispatch) => {
  dispatch(setPartnersLoading(true));
  dispatch(setPartnersError(null));

  return fetch(new Request(`${process.env.API_URL}/partners?published=true`))
    .then(response => response.json())
    .then((data) => {
      dispatch(setPartnersLoading(false));
      dispatch(setPartnersError(null));

      // Deserialize partners
      new Deserializer({
        keyForAttribute: 'underscore_case'
      }).deserialize(data, (err, partners) => {
        dispatch(setPartners(sortBy(partners.filter(p => p.featured), 'name')));
      });
    })
    .catch((err) => {
      dispatch(setPartnersLoading(false));
      dispatch(setPartnersError(err));
    });
});
