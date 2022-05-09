import { createSelector } from 'reselect';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

const getDatasets = (state) => state.datasets.datasets.list;

export const getUpdatedDatasets = createSelector([getDatasets], (_datasets) => {
  return _datasets.map((_dataset) => ({
    ..._dataset,
    dateLastUpdated: getDateConsideringTimeZone(_dataset.dataLastUpdated),
  }));
});

export default { getUpdatedDatasets };
