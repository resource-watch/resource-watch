export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  dataset: {},
  form: {
    // STEP 1
    name: '',
    summary: '',
    description: '',
    content: '',
    // Images
    photo: '',
    user_id: null,
    // States
    published: false,
    private: true,
  },
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
      .map((k) => elements[k].isValid())
      .filter((v) => v !== null)
      .every((element) => element);

    return valid;
  },
};
