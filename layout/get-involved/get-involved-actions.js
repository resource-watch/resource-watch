import {
  createAction,
  createThunkAction,
} from 'redux-tools';

// services
import {
  fetchPage,
} from 'services/pages';

// Actions
export const setStaticData = createAction('GET-INVOLVED-INDEX/setStaticData');
export const setStaticDataLoading = createAction('GET-INVOLVED-INDEX/setStaticDataLoading');
export const setStaticDataError = createAction('GET-INVOLVED-INDEX/setStaticDataError');

export const fetchStaticData = createThunkAction('GET-INVOLVED-INDEX/fetchStaticData', (payload = 'get-involved') => (dispatch) => {
  dispatch(setStaticDataLoading(true));
  dispatch(setStaticDataError(null));

  return fetchPage(payload)
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
});
