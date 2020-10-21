import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

export const WIDGET_EDITOR_DEFAULT_DISABLED_FEATURES = [
  'typography',
  'end-user-filters',
];

export const getRWAdapter = (config = {}) => AdapterModifier(RWAdapter, {
  endpoint: process.env.WRI_API_URL,
  env: process.env.API_ENV,
  applications: process.env.APPLICATIONS.split(','),
  ...config,
});
