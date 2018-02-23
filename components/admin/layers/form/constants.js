export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  form: {
    name: '',
    description: '',
    provider: null,
    layerConfig: {},
    legendConfig: {},
    interactionConfig: {},
    status: 1,
    default: false,
    published: true
  }
};

export const DATA_FORMATS = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'date', value: 'date' }
];

export const FORMAT = {
  options(o) {
    return o.map((item) => {
      return { label: item.column, value: item.column };
    });
  },
  resolveKey(label) {
    const labelLower = label.toLowerCase();
    switch (labelLower) {
      case 'field':
        return 'column';
      case 'label':
        return 'property';
      case 'format':
        return 'type';
      default:
        return labelLower;
    }
  }
};

export const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


export const PROVIDER_OPTIONS = [
  { label: 'Carto', value: 'cartodb' },
  { label: 'ARCGIS: Feature service', value: 'featureservice' },
  { label: 'Leaflet', value: 'leaflet' },
  { label: 'WMS', value: 'wms' },
  { label: 'GEE', value: 'gee' }
];
