import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
// constants
import { CUSTOM_AREA_OPTION } from './constants';

const getAreas = state => state.subscriptions.areas.list;
const getUserAreas = state => state.user.areas.items;
const getUserSubscriptions = state => state.subscriptions.list;
const getUserSelection = state => state.subscriptions.userSelection;

const parseAreas = createSelector(
  [getAreas],
  _areas => _areas.map(area => ({
    label: area.name || '',
    value: area.geostoreId || area.geostore,
    isGeostore: area.geostoreId || area.geostore,
    areaID: null
  }))
);

const parseUserAreas = createSelector(
  [getUserAreas],
  _userAreas => _userAreas.map(userArea => ({
    label: userArea.name,
    value: userArea.id,
    isGeostore: userArea.geostore,
    areaID: userArea.id,
    subscriptions: userArea.subscriptions,
    id: userArea.id
  }))
);

export const getAvailableAreas = createSelector(
  [parseAreas, parseUserAreas],
  (_areas, _userAreas) => {
    const sortedAreas = sortBy([..._areas, ..._userAreas], 'label');

    return [...CUSTOM_AREA_OPTION, ...sortedAreas].filter(option => option.label !== '');
  }
);

export const isAreaFound = createSelector(
  [getUserSubscriptions, getUserSelection],
  (_userSubscriptions, _userSelection) => {
    const { area } = _userSelection;

    if (!area) return false;

    const { areaID } = area;

    return !!(_userSubscriptions.find(subscription =>
      subscription.params.area === areaID));
  }
);

export default {
  getAvailableAreas,
  isAreaFound
};
