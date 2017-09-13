export const PROVIDER_TYPES_DICTIONARY = {
  cartodb: {
    label: 'CartoDB',
    value: 'cartodb',
    connectorType: 'rest',
    connectorUrlHint: 'Example: https://wri-01.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20combined01_prepared%20where%20impactparameter=%27Food Demand%27'
  },
  gee: {
    label: 'GEE',
    value: 'gee',
    connectorType: 'rest',
    connectorUrlHint: 'Example: projects/wri-datalab/HansenComposite_14-15'
  },
  featureservice: {
    value: 'featureservice',
    label: 'Feature Service (Arcgis)',
    connectorType: 'rest',
    connectorUrlHint: 'Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson'
  },
  csv: {
    label: 'CSV',
    value: 'csv',
    basic: true,
    connectorType: 'document',
    connectorUrlHint: 'Format specification: <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank" >https://en.wikipedia.org/wiki/Comma-separated_values</a>'
  },
  json: {
    label: 'JSON',
    value: 'json',
    basic: true,
    connectorType: 'document',
    connectorUrlHint: 'Format specification: <a href="http://www.json.org/" target="_blank" >http://www.json.org/</a>'
  },
  tsv: {
    label: 'TSV',
    value: 'tsv',
    basic: true,
    connectorType: 'document',
    connectorUrlHint: 'Format specification: <a href="https://en.wikipedia.org/wiki/Tab-separated_values" target="_blank" >https://en.wikipedia.org/wiki/Tab-separated_values</a>'
  },
  xml: {
    label: 'XML',
    value: 'xml',
    basic: true,
    connectorType: 'document',
    connectorUrlHint: 'Format specification: <a href="https://www.w3.org/TR/REC-xml/" target="_blank" >https://www.w3.org/TR/REC-xml/</a>'
  },
  wms: {
    label: 'WMS',
    value: 'wms',
    connectorType: 'wms',
    connectorUrlHint: ''
  }
};

export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  dataset: {},
  form: {
    authorization: '',
    // STEP 1
    name: '',
    subtitle: '',
    application: [],
    provider: null,
    connectorType: '',
    connectorUrlHint: '',
    published: false,
    geoInfo: false,
    verified: false,
    env: 'production',
    widgetRelevantProps: [],
    layerRelevantProps: [],

    // STEP 2
    connectorUrl: '',
    dataPath: '',
    legend: {
      lat: undefined,
      long: undefined,
      date: [],
      country: []
    }
  }
};


export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};
