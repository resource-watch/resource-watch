import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

export const WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES = [
  'typography',
  'end-user-filters',
];
export const WIDGET_EDITOR_COLOUR_SCHEMES = [
  {
    name: 'Resource Watch',
    mainColor: '#40B2CE',
    category: [
      '#40B2CE',
      '#2E75AD',
      '#F9B746',
      '#ED4A4D',
      '#68B631',
      '#C22E7A',
      '#F478B7',
      '#63D2B9',
      '#F0812D',
      '#9E1D0D',
      '#A7E9E3',
      '#BAD771',
      '#393F44',
      '#CACCD0',
      '#717171',
    ],
  },
  {
    name: 'WRI',
    mainColor: '#F0AB00',
    category: [
      '#F0AB00',
      '#0099CC',
      '#C51F24',
      '#97BD3D',
      '#7D0063',
      '#007A4D',
      '#003F6A',
      '#E98300',
      '#ED1A37',
      '#FCD900',
      '#434242',
      '#5E5E5D',
      '#767575',
      '#919191',
      '#B7B7B7',
    ],
  },
];

export const getRWAdapter = (config = {}) => AdapterModifier(RWAdapter, {
  endpoint: process.env.WRI_API_URL,
  env: process.env.API_ENV,
  applications: process.env.APPLICATIONS.split(','),
  ...config,
});
