import { createAction, createThunkAction } from 'redux-actions';

// Services
import DatasetService from 'services/DatasetService';

export const getSimilarDatasetsSuccess = createAction('similar-datasets/getSimilarDatasetsSuccess');
export const getSimilarDatasetsLoading = createAction('similar-datasets/getSimilarDatasetsLoading');
export const getSimilarDatasetsError = createAction('similar-datasets/getSimilarDatasetsError');
export const setSimilarDatasets = createAction('similar-datasets/getSimilarDatasets');

// Async actions
export const getSimilarDatasets = createThunkAction('similar-datasets/getSimilarDatasets', (datasetId, locale = 'en') => (dispatch) => {
  dispatch(getSimilarDatasetsLoading());
  const service = new DatasetService(datasetId, { apiURL: process.env.WRI_API_URL, language: 'en' });
  return service.getSimilarDatasets()
    .then((data) => {
      DatasetService.getDatasets(data.map(d => d.dataset), locale, 'widget,metadata,layer,vocabulary')
        .then((similarDatasets) => {
          dispatch(setSimilarDatasets(similarDatasets));
          return similarDatasets;
        });
    })
    .then(() => dispatch(getSimilarDatasetsSuccess()))
    .catch((err) => {
      dispatch(getSimilarDatasetsError({ payload: err.message }));
    });
});
