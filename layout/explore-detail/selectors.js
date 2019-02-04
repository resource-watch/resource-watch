import { createSelector } from 'reselect';

const getDataset = state => state.exploreDetail.data;

export const getDatasetThumbnail = createSelector(
  [getDataset],
  (_dataset) => {
    const defaultWidget = _dataset.widget.find(_widget => _widget.defaultEditableWidget);

    return defaultWidget ? defaultWidget.thumbnailUrl : null;
  }
);

export default { getDatasetThumbnail };
