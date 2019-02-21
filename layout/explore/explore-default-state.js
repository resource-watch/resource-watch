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
    options: {
      topics: TOPICS,
      data_types: DATA_TYPES,
      frequencies: FREQUENCIES,
      time_periods: TIME_PERIODS,
      custom: {
        label: 'Others',
        value: 'custom',
        list: []
      }
    },
    selected: {
      topics: [],
      data_types: [],
      frequencies: [],
      time_periods: [],
      custom: []
    }
  },
  sort: {
    selected: 'most-viewed',
    direction: -1,
    isSetFromDefaultState: true,
    options: [
      { value: 'updatedAt', label: 'Last modified' },
      { value: 'most-viewed', label: 'Most viewed' },
      { value: 'most-favorited', label: 'Most favorited' },
      { value: 'relevance', label: 'Relevance' }
    ]
  },

  // Map
  map: {
    zoom: 3,
    latLng: { lat: 0, lng: 0 },
    location: {},
    basemap: BASEMAPS.dark,
    labels: LABELS.light,
    boundaries: false,
    layerGroups: [],
    layerGroupsInteraction: {},
    layerGroupsInteractionSelected: null,
    layerGroupsInteractionLatLng: null,
    // contains params to be modified in the layerSpec of every layer
    // 'layer-id': {
    //  'key-to-modify: {
    //    stardDate: '09-09-2018',
    //    endDate: '12-31-2019',
    //    zoom: 4,
    //    ...
    //  }
    // }
    //
    parametrization: {}
  },

  // Sidebar
  sidebar: { open: true },

  tags: {
    tooltip: false,
    list: [],
    loading: false,
    error: null
  }
};
