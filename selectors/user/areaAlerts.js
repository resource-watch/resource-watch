import { createSelector } from 'reselect';

const user = (state) => state.user;

const getAreaAlerts = ({ areas }) => {
  const alerts = {};

  if (areas && areas.items) {
    areas.items.map((area) => {
      const { subscription } = area;

      if (!subscription) return null;

      const { datasetsQuery, datasets } = subscription;
      alerts[area.id] = [];

      if (datasetsQuery && datasets) {
        datasetsQuery.map((query, key) => {
          alerts[area.id].push({
            ...query,
            dataset: datasets[key],
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
