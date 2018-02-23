import { createSelector } from 'reselect';

const getToolsList = state => state.list;
const getToolsActive = state => state.active;

export const relatedTools = createSelector(
  [getToolsList, getToolsActive],
  (tools, active) =>
    tools.filter(t => active.includes(t.slug))
);

export default {
  relatedTools
};
