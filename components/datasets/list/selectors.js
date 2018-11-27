import { createSelector } from 'reselect';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

const getDatasets = state => state.datasets.datasets.list;
const getIsServer = state => state.common.isServer;

export const getUpdatedDatasets = createSelector(
  [getDatasets, getIsServer],
  (_datasets, _isServer) => {
    if (_isServer) return _datasets;

    return _datasets.map(_dataset => ({
      ..._dataset,
      dateLastUpdated: getDateConsideringTimeZone(_dataset.dataLastUpdated)
    }));
  }
);


export default { getUpdatedDatasets };
