import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

const getDatasets = state => state.subscriptions.datasets.list;

export const getSuscribableDatasets = createSelector(
  [getDatasets],
  _datasets => sortBy(uniq(_datasets
    .map(dataset => ({
      id: dataset.id,
      label: dataset.metadata && dataset.metadata.length ? dataset.metadata[0].name : dataset.name,
      value: dataset.name,
      subscriptions: sortBy(Object.keys(dataset.subscribable)
        .map(key => ({
          label: key,
          value: key,
          query: ((dataset.subscribable)[key] || {}).dataQuery
        })), 'label'),
      threshold: 1
    }))), 'label')
);

export default { getSuscribableDatasets };
