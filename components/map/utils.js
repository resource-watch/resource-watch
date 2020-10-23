import {
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

export const getUserAreaLayer = ({
  id = 'user-area',
  geojson,
},
template = USER_AREA_LAYER_TEMPLATES['area-card']) => template({ id, geojson });

export default { getUserAreaLayer };
