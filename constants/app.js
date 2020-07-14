export const TRANSIFEX_BLACKLIST = [
  '/app/embed/EmbedDashboard',
  '/app/embed/EmbedMap',
  '/app/embed/EmbedTable',
  '/app/embed/EmbedText',
  '/app/embed/EmbedWidget',
  '/app/embed/EmbedEmbed',
  '/app/embed/EmbedDataset',
  '/app/embed/EmbedSimilarDatasets',
  '/app/explore/embed'
];

export const FULLSCREEN_PAGES = [
  '/data/explore',
  '/data/pulse',
  '/sign-in'
];

export const PAGES_WITHOUT_DASHBOARDS = [
  '/admin',
  '/embed'
];

export const PAGES_WITH_USER_COLLECTIONS = [
  '/myrw-detail/',
  '/myrw/',
  '/data/explore'
];

export const PAGES_WITH_USER_COLLECTIONS_FORCE = [
  '/myrw/collections'
];

export const CESIUM_ROUTES = [
  '/data/pulse'
];

export const HOTJAR_ROUTES = [
  '/data/explore'
];

export default {
  TRANSIFEX_BLACKLIST,
  FULLSCREEN_PAGES,
  PAGES_WITHOUT_DASHBOARDS,
  PAGES_WITH_USER_COLLECTIONS,
  CESIUM_ROUTES
};
