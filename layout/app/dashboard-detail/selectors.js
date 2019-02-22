import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';

const getDashboard = state => state.dashboards.detail.data;

export const getDatasetIds = createSelector(
  [getDashboard],
  (_dashboard = {}) => {
    const { content } = _dashboard;
    if (!content) return [];

    const parsedContent = JSON.parse(content);
    const datasetIds = parsedContent.map((block) => {
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
