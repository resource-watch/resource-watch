import bar from 'utils/widgets/bar';
import pie from 'utils/widgets/pie';
import line from 'utils/widgets/line';


export const STATE_DEFAULT = {
  step: 1,
  stepLength: 1,
  submitting: false,
  loading: false,
  partners: [],
  form: {
    // STEP 1
    application: [process.env.APPLICATIONS],
    name: '',
    queryUrl: '',
    description: '',
    dataset: null,
    source: '',
    sourceUrl: '',
    authors: '',
    widgetConfig: {},
    default: false,
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

export const CONFIG_TEMPLATE = {
  bar: bar({ templateMode: true }),
  line: line({ templateMode: true }),
  pie: pie({ templateMode: true })
};

export const CONFIG_TEMPLATE_OPTIONS = [
  { label: 'Bar', value: 'bar' },
  { label: 'Line', value: 'line' },
  { label: 'Pie', value: 'pie' }
];
