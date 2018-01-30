import { createAction, createThunkAction } from 'redux-tools';

// Services
import DatasetService from 'services/DatasetService';

export const getSimilarDatasetsSuccess = createAction('similar-datasets/getSimilarDatasetsSuccess');
export const getSimilarDatasetsLoading = createAction('similar-datasets/getSimilarDatasetsLoading');
export const getSimilarDatasetsError = createAction('similar-datasets/getSimilarDatasetsError');
export const setSimilarDatasets = createAction('similar-datasets/getSimilarDatasets');
export const resetSimilarDatasets = createAction('similar-datasets/resetSimilarDatasets');

// Async actions
export const getSimilarDatasets = createThunkAction('similar-datasets/getSimilarDatasets', (datasetIds, locale = 'en') => (dispatch) => {
  dispatch(getSimilarDatasetsLoading());
  const service = new DatasetService(null, { apiURL: process.env.WRI_API_URL, language: 'en' });
  return service.getSimilarDatasets(datasetIds)
    .then((data) => {
      if (data.length > 0) {
        DatasetService.getDatasets(data.map(d => d.dataset), locale, 'widget,metadata,layer,vocabulary')
          .then((similarDatasets) => {
            dispatch(setSimilarDatasets(similarDatasets));
            return similarDatasets;
          });
      } else {
        dispatch(setSimilarDatasets([]));
        return [];
      }
    })
    .then(() => dispatch(getSimilarDatasetsSuccess()))
    .catch((err) => {
      dispatch(getSimilarDatasetsError({ payload: err.message }));
    });
});
