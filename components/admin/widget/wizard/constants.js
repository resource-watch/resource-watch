export const STATE_DEFAULT = {
  step: 1,
  stepLength: 3,
  submitting: false,
  loading: false,

  authorization: '',

  // Wizard
  wizard: {
    query: '',
    // query: "SELECT cartodb_id, rank, iso3, total, country FROM d02df2f6-d80c-4274-bb6f-f062061655c4 WHERE iso3 IN ('AGO', 'ARG', 'ALB', 'ARE', 'ARM', 'ASM', 'AFG')",

    // STEP 2
    filters: [{}],
      // {
      //   selected: {},
      //   filters: {
      //     columnName: 'iso3',
      //     columnType: 'string',
      //     properties: {
      //       values: [
      //         'ARG',
      //         'BRA',
      //         'COL',
      //         'PER',
      //         'VEN'
      //       ]
      //     }
      //   }
      // }

    columns: [],
      // {
      //   columnName: 'cartodb_id',
      //   columnType: 'number',
      //   properties: {
      //     min: 1,
      //     max: 209
      //   }
      // },
      // {
      //   columnName: 'rank',
      //   columnType: 'number',
      //   properties: {
      //     min: 1,
      //     max: 209
      //   }
      // },
      // {
      //   columnName: 'iso3',
      //   columnType: 'string',
      //   properties: {
      //     values: []
      //   }
      // },
      // {
      //   columnName: 'total',
      //   columnType: 'number',
      //   properties: {
      //     min: 0,
      //     max: 5.4430915E9
      //   }
      // },
      // {
      //   columnName: 'country',
      //   columnType: 'string',
      //   properties: {
      //     values: []
      //   }
      // }

    // STEP 3
    chart: '' // bar, pie, line
  },

  form: {
    name: '',
    description: '',
    source: '',
    sourceUrl: '',
    authors: '',
    widgetConfig: {},
    status: 1,
    default: true,
    published: true
  }
};

export const FORM_ELEMENTS = {
  elements: {
    step1: {},
    step2: {},
    step3: {}
  },
  validate(step) {
    const elements = this.elements[`step${step}`] || this.elements;
    const elementsArray = Object.keys(elements);
    if (elementsArray.length) {
      console.log(elementsArray);
      elementsArray.forEach((k) => {
        elements[k].validate();
      });
    }
  },
  isValid(step) {
    const elements = this.elements[`step${step}`] || this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};
