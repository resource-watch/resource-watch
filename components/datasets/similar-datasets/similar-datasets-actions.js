import { createAction, createThunkAction } from 'redux-tools';

// Services
import DatasetService from 'services/DatasetService';

export const setSimilarDatasetsLoading = createAction('similar-datasets/setSimilarDatasetsLoading');
export const setSimilarDatasetsError = createAction('similar-datasets/setSimilarDatasetsError');
export const setSimilarDatasets = createAction('similar-datasets/setSimilarDatasets');
export const resetSimilarDatasets = createAction('similar-datasets/resetSimilarDatasets');

// Async actions
export const getSimilarDatasets = createThunkAction('similar-datasets/getSimilarDatasets', (datasetIds, locale = 'en') => (dispatch) => {
  const service = new DatasetService(null, { apiURL: process.env.WRI_API_URL, language: 'en' });

  dispatch(setSimilarDatasetsLoading(true));

  return service.getSimilarDatasets(datasetIds)
    .then((data) => {
      if (data.length > 0) {
        DatasetService.getDatasets(data.map(d => d.dataset), locale, 'widget,metadata,layer,vocabulary')
          .then((similarDatasets) => {
            dispatch(setSimilarDatasetsLoading(false));
            dispatch(setSimilarDatasets(similarDatasets));
            return similarDatasets;
          })
          .catch((err) => {
            dispatch(setSimilarDatasetsLoading(false));
            dispatch(setSimilarDatasetsError({ payload: err.message }));
          });
      } else {
        dispatch(setSimilarDatasetsLoading(false));
        dispatch(setSimilarDatasets([]));
      }
    })
    .catch((err) => {
      dispatch(setSimilarDatasetsLoading(false));
      dispatch(setSimilarDatasetsError({ payload: err.message }));
    });
});
