export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  dataset: {},
  form: {
    // STEP 1
    name: '',
    dashboard_type: null,
    summary: '',
    body: '',
    website: '',
    contact_name: '',
    contact_email: '',
    // Images
    logo: '',
    white_logo: '',
    cover: '',
    icon: '',
    // States
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

export const DASHBOARD_TYPES = [{
  label: 'Dashboard',
  value: 'dashboard'
}, {
  label: 'Founding dashboard',
  value: 'founding_dashboards'
}, {
  label: 'Funder',
  value: 'funders'
}];
