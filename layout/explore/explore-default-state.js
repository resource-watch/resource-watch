import sortBy from 'lodash/sortBy';
import { TOPICS, DATA_TYPES, FREQUENCIES, TIME_PERIODS } from 'utils/concepts';
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

export default {
  // Datasets
  datasets: {
    list: [],
    loading: false,
    error: null,
    page: 1,
    limit: 12,
    total: 0,
    mode: 'grid' // 'grid' or 'list'
  },
  filters: {
    open: false,
    search: '',
    tab: 'topics',
    topics: [],
    data_types: [],
    frequencies: [],
    time_periods: [],
    options: {
      topics: TOPICS,
      data_types: DATA_TYPES,
      frequencies: FREQUENCIES,
      time_periods: TIME_PERIODS
    }
  },
  sort: {
    selected: 'updatedAt',
    direction: -1,
    options: [
      { value: 'updatedAt', label: 'Last modified' },
      { value: 'most-viewed', label: 'Most viewed' },
      { value: 'most-favorited', label: 'Most favorited' }
    ]
  },

  // Map
  map: {
    zoom: 3,
    latLng: { lat: 0, lng: 0 },
    basemap: BASEMAPS.dark,
    labels: LABELS.light,
    boundaries: false,
    layerGroups: [],
    layerGroupsInteraction: {},
    layerGroupsInteractionSelected: null,
    layerGroupsInteractionLatLng: null
  },

  // Sidebar
  sidebar: {
    open: true
  }
};
