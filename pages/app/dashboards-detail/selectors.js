import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

const getDashboardContent = state => state.dashboardDetail.dashboard.content;

export const getDatasetIds = createSelector(
  [getDashboardContent],
  (_content) => {
    const content = JSON.parse(_content);

    const datasetIds = content.map((block) => {
      if (!block) return null;

      if (block.type === 'widget') {
        return block.content.datasetId;
      }

      if (block.type === 'grid') {
        return block.content.map((b) => {
          if (!b) return null;

          if (b.type === 'widget') return b.content.datasetId;

          return null;
        });
      }

      return null;
    });

    return compact(flatten(datasetIds));
  }
);


export default { getDatasetIds };
