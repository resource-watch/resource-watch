import CartoProvider from '@vizzuality/layer-manager-provider-carto';
import { ProviderMaker } from '@vizzuality/layer-manager';

import GeeProvider from './gee';

const cartoProvider = new CartoProvider();
const geeProvider = new GeeProvider();

const providers: Record<string, ProviderMaker['handleData']> = {
  [cartoProvider.name]: cartoProvider.handleData,
  [geeProvider.name]: geeProvider.handleData,
};

export default providers;
