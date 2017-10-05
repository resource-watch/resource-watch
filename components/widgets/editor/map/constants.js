const BASEMAPS = {
  default: {
    id: 'default',
    value: `${process.env.BASEMAP_TILE_URL}`,
    label: 'Default',
    options: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    }
  },
  'stamen.terrain': {
    id: 'stamen.terrain',
    value: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}',
    label: 'Stamen.Terrain',
    options: {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    }
  }
};

export { BASEMAPS };
