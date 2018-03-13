import { BASEMAPS } from 'components/ui/map/constants';

export default {
  // Datasets
  datasets: {
    list: [],
    loading: false,
    error: null,
    page: 1,
    limit: 12,
    total: 0
  },
  mode: 'grid', // 'grid' or 'list'
  filters: {
    search: '',
    concepts: []
  },
  sort: 'modified', /** @type {'modified'|'viewed'|'favourited'} order */

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
