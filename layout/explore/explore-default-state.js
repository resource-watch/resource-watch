import { BASEMAPS } from 'components/ui/map/constants';

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
    search: '',
    concepts: []
  },
  sort: {
    selected: 'modified',
    options: [
      { value: 'modified', label: 'Last modified' },
      { value: 'viewed', label: 'Most viewed' },
      { value: 'favourited', label: 'Most favourited' }
    ]
  },

  // Map
  map: {
    zoom: 3,
    latLng: { lat: 0, lng: 0 },
    basemap: BASEMAPS.dark,
    labels: 'none',
    boundaries: false,
    layers: {
      list: [],
      interaction: {}
    }
  },

  // Sidebar
  sidebar: {
    open: true
  }
};
