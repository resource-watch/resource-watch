import { createSelector } from 'reselect';

// Get the pulse
const user = state => state.user;

// Create a function to compare the current active datatasets and the current pulseIds
const getAreaAlerts = ({ areas }) => {
  const alerts = {};

  if (areas && areas.items) {
    areas.items.map((area) => {
      const { subscription } = area;

      if (!subscription) return null;

      const { datasetsQuery, datasets } = subscription.attributes;
      alerts[area.id] = [];

      if (datasetsQuery && datasets) {
        datasetsQuery.map((query, key) => {
          alerts[area.id].push({
            ...query,
            dataset: datasets[key]
          });
          return query;
        });
      }
      return area;
    });
  }

  return alerts;
};

// Export the selector
export default createSelector(user, getAreaAlerts);
