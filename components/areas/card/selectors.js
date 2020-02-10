import { createSelector } from 'reselect';

// selectors
import areaAlerts from 'selectors/user/areaAlerts';

const getUserArea = (state, props) => props.area;

export const getActiveAlerts = createSelector(
  [getUserArea, areaAlerts],
  (_userArea = {}, _alerts) => {
    const { id } = _userArea;
    return (_alerts[id] || []).map((_alert, index) => ({
      ..._alert,
      id: `${id}-${index}`
    }));
  }
);


export default { getActiveAlerts };
