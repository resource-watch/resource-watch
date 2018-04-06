import 'isomorphic-fetch';
import { createAction, createThunkAction } from 'redux-tools';

// TOOLS
export const setActiveTools = createAction('EXPLORE-DETAIL/setActiveTools');
export const setTools = createAction('EXPLORE-DETAIL/setTools');
export const setToolsLoading = createAction('EXPLORE-DETAIL/setToolsLoading');
export const setToolsError = createAction('EXPLORE-DETAIL/setToolsError');
export const fetchTools = createThunkAction('WIDGET-DETAIL/fetchTools', () => (dispatch) => {
  dispatch(setToolsLoading(true));
  dispatch(setToolsError(null));


  return fetch(new Request(`${process.env.API_URL}/tools`))
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    })
    .then(({ data }) => {
      dispatch(setToolsLoading(false));
      dispatch(setToolsError(null));
      dispatch(setTools(data.map(t => ({ ...t.attributes, id: t.id }))));
    })
    .catch((err) => {
      dispatch(setToolsLoading(false));
      dispatch(setToolsError(err));
    });
});
