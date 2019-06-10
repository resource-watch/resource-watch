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

export const USERREPORT_BLACKLIST = [
  '/app/splash'
];

export const FULLSCREEN_PAGES = [
  '/data/explore',
  '/data/pulse',
  '/splash',
  '/sign-in'
];

export const PAGES_WITHOUT_TOPICS = [
  '/admin',
  '/embed'
];

export const PAGES_WITH_USER_COLLECTIONS = [
  '/myrw-detail/',
  '/myrw/'
];

export const CESIUM_ROUTES = [
  '/data/pulse',
  '/splash'
];

export default {
  TRANSIFEX_BLACKLIST,
  USERREPORT_BLACKLIST,
  FULLSCREEN_PAGES,
  PAGES_WITHOUT_TOPICS,
  PAGES_WITH_USER_COLLECTIONS,
  CESIUM_ROUTES
};
