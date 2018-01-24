import { createAction, createThunkAction } from 'redux-actions';

// Services
import DatasetService from 'services/DatasetService';

export const getSimilarDatasetsSuccess = createAction('similar-datasets/getSimilarDatasetsSuccess');
export const getSimilarDatasetsLoading = createAction('similar-datasets/getSimilarDatasetsLoading');
export const getSimilarDatasetsError = createAction('similar-datasets/getSimilarDatasetsError');
export const setSimilarDatasets = createAction('similar-datasets/getSimilarDatasets');

// Async actions
export const getSimilarDatasets = createThunkAction('similar-datasets/getSimilarDatasets', datasetId => (dispatch) => {
  dispatch(getSimilarDatasetsLoading);
  const service = new DatasetService(datasetId, { apiURL: process.env.WRI_API_URL, language: 'en' });
  return service.getSimilarDatasets()
    .then((data) => {
      dispatch(setSimilarDatasets(data));
      return data;
    })
    .then(() => dispatch(getSimilarDatasetsSuccess))
    .catch((err) => {
      dispatch(getSimilarDatasetsError({ payload: err.message }));
    });
});
