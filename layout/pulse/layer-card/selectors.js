import { createSelector } from 'reselect';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

const getDataset = state => state.layerCardPulse.dataset;
const getIsServer = state => state.common.isServer;

export const getUpdatedDataset = createSelector(
  [getDataset, getIsServer],
  (_dataset, _isServer) => {
    if (_isServer) return _dataset;

    return ({
      ..._dataset,
      dateLastUpdated: getDateConsideringTimeZone(_dataset.dataLastUpdated)
    });
  }
);


export default { getUpdatedDataset };
