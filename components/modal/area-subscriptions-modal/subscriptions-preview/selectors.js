import { createSelector } from 'reselect';

const getAlerts = state => state.subscriptions.preview.list;
const getSelectedDatasets = state => state.subscriptions.userSelection.datasets;

export const parseTableData = createSelector(
  [getAlerts, getSelectedDatasets],
  (_alerts, _datasets) => {
    const selectedSubscriptions = [];
    _datasets.forEach((_dataset) => {
      const found = (_dataset.subscriptions || []).find(_subscription => _subscription.selected);

      if (found) selectedSubscriptions.push(found.label);
    });

    const alerts = _alerts.map((_alert, index) => ({
      title: selectedSubscriptions[index],
      data: _alert.map(_a => ({
        ..._a,
        ..._a.geom && {
          latitude: JSON.parse(_a.geom).coordinates[0],
          longitude: JSON.parse(_a.geom).coordinates[1]
        }
      }))
    }));

    return alerts.map((_alert) => {
      if (_alert.data[0] && _alert.data[0].geom) {
        _alert.data.forEach((_a) => { delete _a.geom; });
      }

      return ({
        ..._alert,
        ..._alert.data[0] && { keys: Object.keys(_alert.data[0]) }
      });
    });
  }
);

export default { parseTableData };
