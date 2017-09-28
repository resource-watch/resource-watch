/* eslint-env jest */
import { getVisualisationTypes } from '../../../../components/widget-editor/helpers/dataset-helpers';

describe('Dataset Helpers', () => {
  it('tabular, rest, carto and with geo dataset should return Map, Chart, Table', () => {
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

    const expectedResult = {
      datasetId: '01ddff59-8cbc-4420-8c0d-9d8317a63292',
      type: 'tabular',
      connectorType: 'rest',
      provider: 'cartodb',
      visualisationTypes: ['Chart', 'Table']
    };

    expect(getVisualisationTypes(datasetData)).toEqual(expectedResult);
  });

  it('tabular, rest, wms and with geo dataset should return Map', () => {
    const datasetData = {
      id: 'da3bd4d9-7e50-4f4a-9f08-e0700497e117',
      "name": "Hydro Reference Overlay - WMS",
      "slug": "Hydro-Reference-Overlay-WMS",
      "type": "raster",
      "subtitle": "",
      "application": ["rw"],
      "dataPath": "",
      "attributesPath": null,
      "connectorType": "wms",
      "provider": "wms",
      "userId": "58fa22c54eecd907310778cd",
      "connectorUrl": "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Esri_Hydro_Reference_Overlay/MapServer/?f=pjson",
      "tableName": null,
      "status": "saved",
      "published": true,
      "overwrite": false,
      "verified": false,
      "blockchain": {},
      "env": "production",
      "geoInfo": false,
      "legend": {
        "date": [],
        "region": [],
        "country": []
      },
      "clonedHost": {},
      "errorMessage": null,
      "updatedAt": "2017-09-21T20:51:47.222Z",
      "widgetRelevantProps": [],
      "layerRelevantProps": []
    }

    const expectedResult = {
      datasetId: 'da3bd4d9-7e50-4f4a-9f08-e0700497e117',
      type: 'raster',
      connectorType: 'wms',
      provider: 'wms',
      visualisationTypes: ['Map']
    };

    expect(getVisualisationTypes(datasetData)).toEqual(expectedResult);
  });
});
