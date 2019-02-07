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
  '/app/embed/EmbedDashboard',
  '/app/embed/EmbedMap',
  '/app/embed/EmbedTable',
  '/app/embed/EmbedText',
  '/app/embed/EmbedWidget',
  '/app/embed/EmbedEmbed',
  '/app/embed/EmbedDataset',
  '/app/embed/EmbedSimilarDatasets',
  '/app/Splash'
];

export const FULLSCREEN_PAGES = [
  '/data/explore',
  '/data/pulse',
  '/Splash',
  '/sign-in'
];

export const PAGES_WITHOUT_TOPICS = [
  '/sign-in'
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
  CESIUM_ROUTES
};
