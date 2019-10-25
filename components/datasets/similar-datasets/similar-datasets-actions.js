import { createAction, createThunkAction } from 'redux-tools';

// Services
import { fetchDatasets } from 'services/dataset';
import { fetchSimilarDatasets } from 'services/graph';

export const setSimilarDatasetsLoading = createAction('similar-datasets/setSimilarDatasetsLoading');
export const setSimilarDatasetsError = createAction('similar-datasets/setSimilarDatasetsError');
export const setSimilarDatasets = createAction('similar-datasets/setSimilarDatasets');
export const resetSimilarDatasets = createAction('similar-datasets/resetSimilarDatasets');

// Async actions
export const getSimilarDatasets = createThunkAction('similar-datasets/getSimilarDatasets', (datasetIds, locale = 'en') => (dispatch) => {
  dispatch(setSimilarDatasetsLoading(true));

  return fetchSimilarDatasets(datasetIds.join(','), true,
    {
      published: true,
      limit: 6
    })
    .then((data) => {
      if (data.length > 0) {
        fetchDatasets({
          ids: data.map(d => d.dataset).join(','),
          language: locale,
          includes: 'widget,metadata,layer,vocabulary'
        })
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
