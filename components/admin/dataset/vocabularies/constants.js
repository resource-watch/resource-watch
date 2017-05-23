export const STATE_DEFAULT = {
  submitting: false,
  loading: false,
  hasVocabularies: false,
  form: {
    authorization: '',
    status: 1
  },
  vocabularies: []
};

export let FORM_ELEMENTS = {
  validate() {
    Object.keys(this.children).forEach((key) => {
      this.children[key].validate();
    });
  },
  isFormValid() {
    const valid = Object.keys(this.children)
      .map(key => this.children[key].isValid())
      .every(element => element === true);

    return valid;
  },
  children: {}
}
