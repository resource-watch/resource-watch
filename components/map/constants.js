
export const BASEMAPS = {
  dark: {
    id: 'dark',
    value: 'darker',
    label: 'Dark',
    options: { attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>' }
  },
  light: {
    id: 'light',
    value: 'light',
    label: 'Light',
    options: { attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>' }
  },
  satellite: {
    id: 'satellite',
    value: 'satellite',
    label: 'Satellite',
    options: { attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>' }
  },
  terrain: {
    id: 'terrain',
    value: 'terrain',
    label: 'Terrain',
    options: { attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>' }
  },
  aqueduct: {
    id: 'aqueduct',
    value: 'aqueduct',
    label: 'Hydrography',
    options: { attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>' }
  }
};

export const LABELS = {
  none: {
    id: 'none',
    label: 'No labels',
    value: null
  },
  light: {
    id: 'light',
    label: 'Labels light',
    value: 'light'
  },
  dark: {
    id: 'dark',
    label: 'Labels dark',
    value: 'dark'
  }
};

export const BOUNDARIES = {
  dark: {
    id: 'dark',
    label: 'Boundaries',
    value: false
  }
};

export const DEFAULT_VIEWPORT = {
  zoom: 2,
  lat: 0,
  lng: 0,
  pitch: 0,
  bearing: 0
};

export default { BASEMAPS, LABELS, BOUNDARIES };
