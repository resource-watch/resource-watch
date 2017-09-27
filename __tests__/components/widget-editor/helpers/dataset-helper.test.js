/* eslint-env jest */
import { getVisualisationTypes } from '../../../../components/widget-editor/helpers/dataset-helpers';

const datasetData = {
  id: '01ddff59-8cbc-4420-8c0d-9d8317a63292',
  name: 'Flood Risk',
  slug: 'Global-flood-risk',
  type: null,
  subtitle: '',
  application: ['rw'],
  dataPath: '',
  attributesPath: null,
  connectorType: 'rest',
  provider: 'cartodb',
  userId: '57a0aa1071e394dd32ffe137',
  connectorUrl: 'https://wri-rw.carto.com/api/v2/sql?q=SELECT%20*%20FROM aqueduct_global_flood_risk_data_by_country_20150304',
  tableName: 'aqueduct_global_flood_risk_data_by_country_20150304',
  status: 'saved',
  published: true,
  overwrite: false,
  verified: false,
  blockchain: {},
  env: 'production',
  geoInfo: false,
  legend: {
    date: [],
    region: [],
    country: [],
    long: null,
    lat: null
  },
  clonedHost: {},
  errorMessage: null,
  updatedAt: '2017-09-12T15:25:35.303Z',
  widgetRelevantProps: [],
  layerRelevantProps: []
};

describe('Dataset Helpers', () => {
  it('getVisualisationTypes', () => {
    const expectedResult = {
      datasetId: '01ddff59-8cbc-4420-8c0d-9d8317a63292',
      type: 'tabular',
      connectorType: 'rest',
      provider: 'cartodb',
      visualisationTypes: ['Chart', 'Table']
    };
    expect(getVisualisationTypes(datasetData)).toEqual(expectedResult);
  });
});
