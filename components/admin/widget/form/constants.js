export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  form: {
    authorization: '',
    name: '',
    queryUrl: '',
    description: '',
    source: '',
    sourceUrl: '',
    authors: '',
    widgetConfig: {},
    default: false,
    status: 1,
    verified: true,
    published: true
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
