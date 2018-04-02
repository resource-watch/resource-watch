export const STATE_DEFAULT = {
  submitting: false,
  submitted: false,
  form: {
    topic: 'General question or feedback',
    email: '',
    text: ''
  }
};

export const FORM_TOPICS = {
  options: [
    {
      value: 'General question or feedback',
      label: 'General question or feedback'
    },
    { value: 'Bug report',
      label: 'Bug report'
    },
    {
      value: 'Data request or suggestion',
      label: 'Data request or suggestion'
    },
    { value: 'Media inquiry',
      label: 'Media inquiry'
    },
    { value: 'Other',
      label: 'Other'
    }
  ]
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
