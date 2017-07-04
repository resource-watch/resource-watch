import React from 'react';

// Utils
import { substitution } from 'utils/utils';

// Constants
import { PROVIDER_TYPES_DICTIONARY, FORM_ELEMENTS } from 'components/admin/dataset/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: props.dataset,
      form: props.form,
      carto: {}
    };

    // BINDINGS
    this.onCartoFieldsChange = this.onCartoFieldsChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  /*
    UI EVENTS
  */
  onCartoFieldsChange() {
    const { cartoAccountUsername, tableName } = this.state.carto;

    const url = 'https://{{cartoAccountUsername}}.carto.com/tables/{{tableName}}/public';
    const params = [
      { key: 'cartoAccountUsername', value: cartoAccountUsername },
      { key: 'tableName', value: tableName }
    ];

    this.props.onChange({
      connectorUrl: substitution(url, params)
    });
  }

  render() {
    const { dataset } = this.state;
    const { provider } = this.state.form;

    const isCarto = (provider === 'cartodb');
    const isGee = (provider === 'gee');
    const isFeatureservice = (provider === 'featureservice');
    const isJson = (provider === 'json');
    const isCsv = (provider === 'csv');
    const isTsv = (provider === 'tsv');
    const isXml = (provider === 'xml');

    return (
      <fieldset className="c-field-container">
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.name = c; }}
          onChange={value => this.props.onChange({ name: value })}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Title',
            type: 'text',
            required: true,
            default: this.state.form.name
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.subtitle = c; }}
          onChange={value => this.props.onChange({ subtitle: value })}
          properties={{
            name: 'subtitle',
            label: 'Subtitle',
            type: 'text',
            default: this.state.form.subtitle
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.provider = c; }}
          onChange={value => this.props.onChange({
            provider: value,
            connectorType: PROVIDER_TYPES_DICTIONARY[value].connectorType
          })}
          validations={['required']}
          blank
          options={Object.keys(PROVIDER_TYPES_DICTIONARY).map(key => (
            {
              label: PROVIDER_TYPES_DICTIONARY[key].label,
              value: PROVIDER_TYPES_DICTIONARY[key].value
            }
          ))}
          properties={{
            name: 'provider',
            label: 'Provider',
            default: this.state.form.provider,
            value: this.state.form.provider,
            disabled: !!this.state.dataset,
            required: true,
            instanceId: 'selectProvider'
          }}
        >
          {Select}
        </Field>

        {/*
          *****************************************************
          ****************** CARTODB FIELDS * ***************
          *****************************************************
        */}
        {isCarto && !dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.cartoAccountUsername = c; }}
            onChange={(value) => {
              this.setState(
                { carto: { ...this.state.carto, cartoAccountUsername: value } }, () => {
                  this.onCartoFieldsChange('cartoAccountUsername', value);
                });
            }}
            validations={['required']}
            properties={{
              name: 'cartoAccountUsername',
              label: 'Carto account username',
              type: 'text',
              default: this.state.form.cartoAccountUsername,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {isCarto && !dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.tableName = c; }}
            onChange={(value) => {
              this.setState({ carto: { ...this.state.carto, tableName: value } }, () => {
                this.onCartoFieldsChange('tableName', value);
              });
            }}
            validations={['required']}
            properties={{
              name: 'tableName',
              label: 'Table name',
              type: 'text',
              default: this.state.form.tableName,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {isCarto && !!dataset &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.connectorUrl = c; }}
            validations={['required']}
            properties={{
              name: 'connectorUrl',
              label: 'connectorUrl',
              type: 'text',
              default: this.state.form.connectorUrl,
              disabled: true,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {/*
          *****************************************************
          ****************** GEE FIELDS * ***************
          *****************************************************
        */}
        {isGee &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.tableName = c; }}
            onChange={value => this.props.onChange({ tableName: value })}
            validations={['required']}
            hint="Example: projects/wri-datalab/HansenComposite_14-15"
            properties={{
              name: 'tableName',
              label: 'Table name',
              type: 'text',
              default: this.state.form.tableName,
              required: true
            }}
          >
            {Input}
          </Field>
        }

        {isFeatureservice &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.connectorUrl = c; }}
            onChange={value => this.props.onChange({ connectorUrl: value })}
            validations={['required', 'url']}
            hint="Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson"
            properties={{
              name: 'connectorUrl',
              label: 'Url data endpoint',
              type: 'text',
              default: this.state.form.connectorUrl,
              required: true
            }}
          >
            {Input}
          </Field>
        }
      </fieldset>
    );
  }
}

Step1.propTypes = {
  dataset: React.PropTypes.string,
  form: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step1;
