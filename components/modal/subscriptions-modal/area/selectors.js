import { createSelector } from 'reselect';

const getCurrentArea = state => state.subscriptions.userSelection.area;
const getUserSubscriptions = state => state.subscriptions.list;

export const getSubscriptionsByArea = createSelector(
  [getCurrentArea, getUserSubscriptions],
  (_area, _subscriptions) => {
    if (!_area) return [];

    return _subscriptions.filter(_susbcription =>
      _susbcription.attributes.params.area === _area.id);
  }
);

export default { getSubscriptionsByArea };
