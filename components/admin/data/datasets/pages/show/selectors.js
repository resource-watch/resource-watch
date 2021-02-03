import { createSelector } from 'reselect';

// utils
import { substitution } from 'layer-manager';

// constants
import { DATASET_SUBTABS } from './constants';

const getQueryId = (state) => state.routes.query.id;

export const parseTabs = createSelector(
  [getQueryId],
  (id) => JSON.parse(substitution(JSON.stringify(DATASET_SUBTABS), { id })),
);

export default { parseTabs };
