import { createSelector } from 'reselect';

// utils
import { getDateConsideringTimeZone } from 'utils/utils';

const getDatasets = state => state.explore.datasets.list;
const getIsServer = state => state.common.isServer;
const getTags = state => state.explore.filters.tags;
const getSelectedTags = state => state.explore.filters.selected.topics;

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

export const getSelectedTagsWithData = createSelector(
  [getTags, getSelectedTags],
  (_tags, _selectedTags) => _selectedTags.map(t => ({
    id: t,
    label: _tags.find(e => e.id === t).label
  }))
);


export default { getUpdatedDatasets, getSelectedTagsWithData };
