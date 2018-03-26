import 'isomorphic-fetch';

import { createAction, createThunkAction } from 'redux-tools';

// The pages have chnged titles and lookup required to match to old slug
const lookup = {
  'suggest-a-story': 'submit-an-insight',
  'contribute-data': 'contribute-data',
  'join-the-community': 'join-community',
  'develop-your-app': 'develop-app',
  'app-review-policy': 'app-review-policy',
  'partner-application-guidelines': 'partner-application-guidelines',
  'data-policy': 'data-policy'
};

// Actions
export const setStaticData = createAction('GET-INVOLVED-DETAIL/setStaticData');
export const setStaticDataLoading = createAction('GET-INVOLVED-DETAIL/setStaticDataLoading');
export const setStaticDataError = createAction('GET-INVOLVED-DETAIL/setStaticDataError');

export const fetchStaticData = createThunkAction('GET-INVOLVED-DETAIL/fetchStaticData', payload => (dispatch) => {
  dispatch(setStaticDataLoading(true));
  dispatch(setStaticDataError(null));

  return fetch(new Request(`${process.env.API_URL}/static_pages/${lookup[payload]}`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setStaticDataLoading(false));
      dispatch(setStaticDataError(null));
      dispatch(setStaticData({ name: payload, ...data.attributes }));
    })
    .catch((err) => {
      dispatch(setStaticDataLoading(false));
      dispatch(setStaticDataError(err));
    });
});
