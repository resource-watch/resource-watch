export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  dataset: {},
  form: {
    // STEP 1
    name: '',
    partner_type: null,
    description: '',
    content: '',
    url: '',
    contact_name: '',
    contact_email: '',
    thumbnail: '',
    logo: '',
    white_logo: '',
    featured: false,
    published: false
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

export const PARTNER_TYPES = [{
  label: 'Partner',
  value: 'partner'
}, {
  label: 'Founding partner',
  value: 'founding partner'
}];
