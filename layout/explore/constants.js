export const EXPLORE_SECTIONS = {
  DISCOVER: 'Discover',
  ALL_DATA: 'All data',
  NEAR_REAL_TIME: 'Near Real-Time',
  TOPICS: 'Topics',
  AREAS_OF_INTEREST: 'Areas of Interest',
  COLLECTIONS: 'Collections',
  FAVORITES: 'Favorites',
  ...(!process.env.NEXT_PUBLIC_FEATURE_FLAG_MY_DATA && {
    MY_DATA: 'My Data',
  }),
};

export const EXPLORE_SUBSECTIONS = {
  NEW_AREA: 'area/new',
};

// * ad hoc list of datasets to test integration with https://schema.org/docs/gs.html
export const DATASETS_WITH_SCHEMA = [
  'Gender-Gap-Index-2',
  'soc025-Gender-Inequality-Index',
  'GINI-Index',
  'Material-Extraction-Trade-and-Use',
  'Wetlands-and-Waterbodies',
  'Trees-in-Mosaic-Landscapes',
  'foo065brw1-Global-Cropland-Change',
  'soc-003-2015-Gridded-Infant-Mortality',
  'Population-Exposed-to-Unhealthy-Levels-of-PM-25',
];
