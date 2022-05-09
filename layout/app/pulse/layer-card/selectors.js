import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

const getDataset = (state) => state.layerCardPulse.dataset;

export const getUpdatedDataset = createSelector([getDataset], (_dataset) => {
  if (isEmpty(_dataset)) return _dataset;

  return {
    ..._dataset,
    dataLastUpdated: getDateConsideringTimeZone(_dataset.dataLastUpdated),
  };
});

export default { getUpdatedDataset };
