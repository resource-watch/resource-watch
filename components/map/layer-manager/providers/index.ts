import CartoProvider from '@vizzuality/layer-manager-provider-carto';
import { ProviderMaker } from '@vizzuality/layer-manager';

import GeeProvider from './gee';
import WMSProvider from './wms';
import FeatureServiceProvider from './feature-service';

const cartoProvider = new CartoProvider();
const geeProvider = new GeeProvider();
const wmsProvider = new WMSProvider();
const featureServiceProvider = new FeatureServiceProvider();

const providers: Record<string, ProviderMaker['handleData']> = {
  [cartoProvider.name]: cartoProvider.handleData,
  [geeProvider.name]: geeProvider.handleData,
  [wmsProvider.name]: wmsProvider.handleData,
  [featureServiceProvider.name]: featureServiceProvider.handleData,
};

export default providers;
