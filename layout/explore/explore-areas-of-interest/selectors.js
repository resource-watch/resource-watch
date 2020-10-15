import { createSelector } from 'reselect';

// states
const getAreasOnMap = (state) => state.explore.map.areas;

export const getAreaIds = createSelector(
  [getAreasOnMap],
  (_areas) => _areas.map(({ id }) => id),
);

export default { getAreasOnMap };
