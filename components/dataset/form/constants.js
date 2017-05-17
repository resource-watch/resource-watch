export const APPLICATIONS = [
  { label: 'Resource Watch', value: 'rw' },
  { label: 'Aqueduct', value: 'aqueduct' }
];

export const TOPICS = [
  { label: 'Cities', value: 'cities' },
  { label: 'Climate', value: 'climate' },
  { label: 'Energy', value: 'energy' },
  { label: 'Forests', value: 'forests' },
  { label: 'Food', value: 'food' },
  { label: 'Land classification', value: 'land_classification' },
  { label: 'Society', value: 'society' },
  { label: 'Supply chain', value: 'supply_chain' },
  { label: 'Water', value: 'water' }
];

export const CONNECTOR_TYPES = [
  { label: 'REST', value: 'rest' },
  { label: 'Document', value: 'document' },
  { label: 'WMS', value: 'wms' }
];

export const CONNECTOR_TYPES_DICTIONARY = {
  rest: {
    cartodb: {
      label: 'CartoDB',
      value: 'cartodb',
      connectorUrlHint: 'Example: https://wri-01.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20combined01_prepared%20where%20impactparameter=%27Food Demand%27'
    },
    gee: {
      label: 'GEE',
      value: 'gee',
      connectorUrlHint: 'Example: projects/wri-datalab/HansenComposite_14-15'
    },
    featureservice: {
      value: 'featureservice',
      label: 'Feature Service (Arcgis)',
      connectorUrlHint: 'Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson'
    }
  },
  document: {
    csv: {
      label: 'CSV',
      value: 'csv',
      connectorUrlHint: 'Format specification: <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank" >https://en.wikipedia.org/wiki/Comma-separated_values</a>'
    },
    json: {
      label: 'JSON',
      value: 'json',
      connectorUrlHint: 'Format specification: <a href="http://www.json.org/" target="_blank" >http://www.json.org/</a>'
    },
    tsv: {
      label: 'TSV',
      value: 'tsv',
      connectorUrlHint: 'Format specification: <a href="https://en.wikipedia.org/wiki/Tab-separated_values" target="_blank" >https://en.wikipedia.org/wiki/Tab-separated_values</a>'
    },
    xml: {
      label: 'XML',
      value: 'xml',
      connectorUrlHint: 'Format specification: <a href="https://www.w3.org/TR/REC-xml/" target="_blank" >https://www.w3.org/TR/REC-xml/</a>'
    }
  },
  wms: {
    wms: {
      label: 'WMS',
      value: 'wms',
      connectorUrlHint: ''
    }
  }
};

export const STATE_DEFAULT = {
  step: 1,
  stepLength: 2,
  submitting: false,
  loading: false,
  dataset: {},
  form: {
    authorization: '',
    // STEP 1
    name: '',
    subtitle: '',
    application: [],
    provider: '',
    connectorType: '',
    connectorUrlHint: '',

    // STEP 2
    connectorUrl: '',
    dataPath: '',
    legend: {
      lat: null,
      long: null,
      date: [],
      country: []
    }
  }
};


export const FORM_ELEMENTS = {
  elements: {
    step1: {},
    step2: {}
  },
  validate(step) {
    const elements = this.elements[`step${step}`] || this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid(step) {
    const elements = this.elements[`step${step}`] || this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};
