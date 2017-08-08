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
    status: 1,
    default: false,
    published: true
  }
};


export const FORM_ELEMENTS = {
  elements: {
  },
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


export const PROVIDER_OPTIONS = [
  { label: 'Carto', value: 'cartodb' },
  { label: 'ARCGIS: Feature service', value: 'arcgis' },
  { label: 'Leaflet', value: 'leaflet' }
];
