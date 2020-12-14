import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

export const getUserAreaLayer = ({
  id = 'user-area',
  geojson,
},
template = USER_AREA_LAYER_TEMPLATES['area-card']) => template({ id, geojson });

// use it to parse a bbox coming from widget-editor
// and want to render in a Mapbox map
export const parseBbox = (bbox) => [
  bbox[1],
  bbox[0],
  bbox[3],
  bbox[2],
];
