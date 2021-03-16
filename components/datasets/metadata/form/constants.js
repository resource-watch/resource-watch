export const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Português', value: 'pt' },
];

export const RASTER_COLUMN_TYPES = [
  { label: 'Categorical', value: 'categorical' },
  { label: 'Continuous', value: 'continuous' },
];

export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  form: {
    source: '',
    description: '',
    name: '',
    language: 'en',
    info: {},
    columns: {},
    application: process.env.NEXT_PUBLIC_APPLICATIONS,
  },
};

export const FORM_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map((k) => elements[k].isValid())
      .filter((v) => v !== null)
      .every((element) => element);

    return valid;
  },
};

export const SOURCE_ELEMENTS = {
  elements: {},
  validate() {
    const { elements } = this;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const { elements } = this;
    const valid = Object.keys(elements)
      .map((k) => elements[k].isValid())
      .filter((v) => v !== null)
      .every((element) => element);

    return valid;
  },
};
