import {
  createAction,
  createThunkAction,
} from 'redux-tools';

// services
import {
  fetchPage,
} from 'services/pages';

// The pages have changed titles and lookup required to match to old slug
const lookup = {
  'suggest-a-story': 'suggest-a-story',
  'contribute-data': 'contribute-data',
  'join-the-community': 'join-community',
  'develop-your-app': 'develop-app',
  'app-review-guidelines': 'app-review-guidelines',
  'partner-application-guidelines': 'partner-application-guidelines',
  'data-policy': 'data-policy',
  apps: 'app-gallery',
};

// Actions
export const setStaticData = createAction('GET-INVOLVED-DETAIL/setStaticData');
export const setStaticDataLoading = createAction('GET-INVOLVED-DETAIL/setStaticDataLoading');
export const setStaticDataError = createAction('GET-INVOLVED-DETAIL/setStaticDataError');

export const fetchStaticData = createThunkAction(
  'GET-INVOLVED-DETAIL/fetchStaticData',
  (payload) => (dispatch) => {
    dispatch(setStaticDataLoading(true));
    dispatch(setStaticDataError(null));

    return fetchPage(lookup[payload])
      .then((data) => {
        dispatch(setStaticDataLoading(false));
        dispatch(setStaticDataError(null));
        dispatch(setStaticData({
          name: payload,
          ...data,
        }));
      })
      .catch((err) => {
        dispatch(setStaticDataLoading(false));
        dispatch(setStaticDataError(err));
      });
  },
);
