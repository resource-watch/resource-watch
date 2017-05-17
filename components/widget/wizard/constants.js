export const STATE_DEFAULT = {
  step: 4,
  stepLength: 5,
  submitting: false,
  loading: false,

  // Wizard
  wizard: {
    authorization: '',
    // STEP 1
    dataset: {
      id: 'd02df2f6-d80c-4274-bb6f-f062061655c4', // Required
      tableName: 'estimated_co2_emission_filtered'
    },
    // STEP 2
    widget: '', // Optional

    // STEP 3
    metadata: {
      technical_title: '',
      title: '',
      subtitle: '',
      source: '',
      functions: '',
      geographic_coverage: '',
      spatial_resolution: '',
      date_of_content: '',
      frequency_of_updates: '',
      cautions: '',
      license: '',
      license_link: '',
      overview: '',
      why: '',
      citation: '',
      other: ''
    },

    query: 'SELECT * FROM estimated_co2_emission_filtered WHERE iso3 IN (\'ARG\',\'BRA\',\'COL\',\'PER\',\'VEN\')',

    // STEP 4
    filters: [
      {
        selected: {},
        filters: {
          columnName: 'iso3',
          columnType: 'string',
          properties: {
            values: [
              'ARG',
              'BRA',
              'COL',
              'PER',
              'VEN'
            ]
          }
        }
      }
    ],

    columns: [
      {
        columnName: 'cartodb_id',
        columnType: 'number',
        properties: {
          min: 1,
          max: 209
        }
      },
      {
        columnName: 'rank',
        columnType: 'number',
        properties: {
          min: 1,
          max: 209
        }
      },
      {
        columnName: 'iso3',
        columnType: 'string',
        properties: {
          values: []
        }
      },
      {
        columnName: 'total',
        columnType: 'number',
        properties: {
          min: 0,
          max: 5.4430915E9
        }
      },
      {
        columnName: 'country',
        columnType: 'string',
        properties: {
          values: []
        }
      }
    ],

    // STEP 5
    chart: '', // bar, pie, line

    // FORM SUBMIT
    form: {
      authorization: '',
      name: '',
      queryUrl: '',
      description: '',
      source: '',
      sourceUrl: '',
      authors: '',
      widgetConfig: {},
      status: 1,
      default: true,
      published: true
    }
  }
};
