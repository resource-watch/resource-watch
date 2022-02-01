import isNumber from 'lodash/isNumber';
import { ViewportProps } from 'react-map-gl';
import { APILayerSpec } from 'types/layer';
import { Basemap, Labels } from './types';

export const MAPSTYLES = 'mapbox://styles/resourcewatch/cjzmw480d00z41cp2x81gm90h';

export const BASEMAPS = {
  dark: {
    id: 'dark',
    value: 'dark',
    label: 'Dark',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  light: {
    id: 'light',
    value: 'light',
    label: 'Light',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  satellite: {
    id: 'satellite',
    value: 'satellite',
    label: 'Satellite',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  terrain: {
    id: 'terrain',
    value: 'terrain',
    label: 'Terrain',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
  aqueduct: {
    id: 'aqueduct',
    value: 'aqueduct',
    label: 'Hydrography',
    options: {
      attribution:
        '<a href="https://www.mapbox.com/about/maps/" target="_blank">© Mapbox</a> <a href="http://www.openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>',
    },
  },
};

export const LABELS = {
  none: {
    id: 'none',
    label: 'No labels',
    value: 'none',
  },
  light: {
    id: 'light',
    label: 'Labels light',
    value: 'light',
  },
  dark: {
    id: 'dark',
    label: 'Labels dark',
    value: 'dark',
  },
};

export const BOUNDARIES = {
  dark: {
    id: 'dark',
    label: 'Boundaries',
    value: false,
  },
};

export const DEFAULT_VIEWPORT: ViewportProps = {
  zoom: 2,
  latitude: 0,
  longitude: 0,
  pitch: 0,
  bearing: 0,
  transitionDuration: 250,
};

export const USER_AREA_LAYER_TEMPLATES = {
  explore: ({ id, geojson, minZoom }): Partial<APILayerSpec & { isAreaOfInterest: boolean }> => ({
    id,
    isAreaOfInterest: true,
    layerConfig: {
      type: 'geojson',
      source: {
        type: 'geojson',
        data: geojson,
      },
      render: {
        layers: [
          {
            type: 'line',
            source: id,
            paint: {
              'line-color': 'hsl(40, 95%, 58%)',
              ...(!minZoom && {
                'line-width': 2,
              }),
              ...(isNumber(minZoom) && {
                'line-width': ['interpolate', ['linear'], ['zoom'], minZoom, 2, minZoom + 2, 0],
              }),
              'line-offset': -2,
            },
          },
          {
            type: 'line',
            source: id,
            paint: {
              ...(!minZoom && {
                'line-width': 2,
              }),
              ...(isNumber(minZoom) && {
                'line-width': ['interpolate', ['linear'], ['zoom'], minZoom, 2, minZoom + 2, 0],
              }),
            },
          },
        ],
      },
    },
  }),
  'area-card': ({ id, geojson }): Partial<APILayerSpec & { isAreaOfInterest: boolean }> => ({
    id,
    isAreaOfInterest: true,
    layerConfig: {
      type: 'geojson',
      source: {
        type: 'geojson',
        data: geojson,
      },
      render: {
        layers: [
          {
            type: 'line',
            source: id,
            paint: { 'line-color': '#fab72e' },
          },
          {
            type: 'fill',
            source: id,
            paint: {
              'fill-color': '#fab72e',
              'fill-opacity': 0.2,
            },
          },
        ],
      },
    },
  }),
};

export const BASEMAP_LABEL_DICTIONARY: Record<Basemap, Labels> = {
  dark: 'light',
  light: 'dark',
  satellite: 'light',
  terrain: 'dark',
  aqueduct: 'dark',
};
