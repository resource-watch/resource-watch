import { createSelector } from 'reselect';

const getCollections = state => state.user.collections.items;
const getTab = state => state.routes.query.tab;

const parseTabCollections = (collections, tab) =>
  collections.map(collection => ({
    id: collection.id,
    label: collection.attributes.name,
    value: collection.id,
    route: 'myrw',
    params: { tab, subtab: collection.id }
  }));

export const getParsedCollections = createSelector([getCollections, getTab], parseTabCollections);

export default {
  getParsedCollections
};
