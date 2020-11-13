import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

export const getRWAdapter = (config = {}) => AdapterModifier(RWAdapter, {
  endpoint: process.env.WRI_API_URL,
  env: process.env.API_ENV,
  applications: process.env.APPLICATIONS.split(','),
  ...config,
});

export default { getRWAdapter };
