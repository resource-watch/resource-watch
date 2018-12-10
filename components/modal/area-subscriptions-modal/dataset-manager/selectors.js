import { createSelector } from 'reselect';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

const getDatasets = state => state.subscriptions.datasets.list;

export const getSuscribableDatasets = createSelector(
  [getDatasets],
  _datasets => sortBy(uniq(_datasets
    .filter(dataset => Object.keys(dataset.subscribable || dataset.attributes.subscribable).length)
    .map(dataset => ({
      id: dataset.id,
      label: dataset.attributes.name,
      value: dataset.attributes.name,
      subscriptions: sortBy(Object.keys(dataset.subscribable || dataset.attributes.subscribable)
        .map(val => ({ label: val, value: val })), 'label'),
      threshold: 1
    }))), 'label')
);

export default { getSuscribableDatasets };
