import ReactGA from 'react-ga';
import { dispatch } from 'main';
import { setDatasetsPage, setDatasetsActive } from 'redactions/explore';

export function onEnterExploreUrlParams(nextState, replace, done) {
  const nextLocation = nextState.location;
  if (nextLocation.query.page) {
    dispatch(setDatasetsPage(+nextLocation.query.page));
  }

  if (nextLocation.query.active) {
    const active = nextLocation.query.active.split(',');
    dispatch(setDatasetsActive(active));
  }

  done();
}

export function onChangeExploreUrlParams(prevState, nextState, replace, done) {
  const prevLocation = prevState.location;
  const nextLocation = nextState.location;
  /* PAGE */
  if (prevLocation.query.page !== nextLocation.query.page) {
    dispatch(setDatasetsPage(+nextLocation.query.page));
  }

  if (nextLocation.query.active) {
    const active = nextLocation.query.active.split(',');
    dispatch(setDatasetsActive(active));
  }

  done();
}

export function shouldUpdateScroll(prevRouterProps, { location }) {
  const noScrollSections = [];

  const path = (prevRouterProps && prevRouterProps.location.pathname.split('/')[1]) || '';
  const nextPath = location.pathname.split('/')[1];

  return !(path === nextPath && noScrollSections.indexOf(nextPath) > -1);
}

export function trackPageView() {
  let currentUrl = window.location.pathname;

  if (window.location.search) {
    currentUrl += window.location.search;
  }

  ReactGA.set({ page: currentUrl });
  ReactGA.pageview(currentUrl);
}
