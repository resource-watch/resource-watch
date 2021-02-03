import { createSelector } from 'reselect';

// utils
import { containsString } from 'utils/string';

// constants
import { FULLSCREEN_PAGES } from 'constants/app';

// states
const getPathname = (state) => state.routes.pathname;

export const isFullScreen = createSelector(
  [getPathname],
  (_pathname) => containsString(_pathname, FULLSCREEN_PAGES),
);

export default { isFullScreen };
