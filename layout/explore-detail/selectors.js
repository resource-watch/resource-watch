import { createSelector } from 'reselect';

const getDataset = state => state.exploreDetail.data;

export const getDatasetThumbnail = createSelector(
  [getDataset],
  (_dataset = {}) => {
    if (!_dataset.widget) return null;

    const defaultWidget = _dataset.widget.find(_widget => _widget.defaultEditableWidget);

    return defaultWidget ? defaultWidget.thumbnailUrl : null;
  }
);

export default { getDatasetThumbnail };
