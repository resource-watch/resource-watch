import React from 'react';

import { CONNECTOR_TYPES_DICTIONARY, FORM_ELEMENTS } from '../constants';

import Step from './step';
import Field from 'components/form/Field';
import Input from 'components/form/Input';

class Step2 extends Step {
  constructor(props) {
    super(props);

    this.state = {
      form: props.form
    };

    this.onLegendChange = this.onLegendChange.bind(this);
  }

  /**
   * UI EVENTS
   * - onLegendChange
  */
  onLegendChange(obj) {
    const legend = Object.assign({}, this.props.form.legend, obj);
    this.props.onChange({ legend });
  }

  /**
   * HELPERS
   * - getHint
  */
  getHint() {
    const { form } = this.state;
    return CONNECTOR_TYPES_DICTIONARY[form.connectorType][form.provider].connectorUrlHint;
  }

  render() {
    const hint = this.getHint();
    const { provider, connectorType } = this.state.form;

    const isDocument = connectorType === 'document';

    const isJson = (provider === 'json');
    const isXml = (provider === 'xml');
    const isGee = (provider === 'gee');


    return (
      <fieldset className="c-field-container">
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.connectorUrl = c; }}
          onChange={value => this.props.onChange({ connectorUrl: value })}
          validations={(isGee) ? ['required'] : ['required', 'url']}
          hint={hint}
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

        {(isJson || isXml) &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.dataPath = c; }}
            onChange={value => this.props.onChange({ dataPath: value })}
            hint="Name of the element that you want to import"
            properties={{
              name: 'dataPath',
              label: 'Data path',
              type: 'text',
              default: this.state.form.dataPath,
              required: isXml
            }}
          >
            {Input}
          </Field>
        }

        {isDocument &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.lat = c; }}
            onChange={value => this.onLegendChange({ lat: value })}
            hint="Name of column with latitude value"
            properties={{
              name: 'lat',
              label: 'Latitude',
              type: 'text',
              default: this.state.form.legend.lat
            }}
          >
            {Input}
          </Field>
        }
        {isDocument &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.long = c; }}
            onChange={value => this.onLegendChange({ long: value })}
            hint="Name of column with longitude value"
            properties={{
              name: 'long',
              label: 'Longitude',
              type: 'text',
              default: this.state.form.legend.long
            }}
          >
            {Input}
          </Field>
        }
        {isDocument &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.date = c; }}
            onChange={value => this.onLegendChange({ date: value })}
            hint="Name of columns with date value (ISO Format)"
            properties={{
              name: 'date',
              label: 'Date',
              type: 'text',
              default: this.state.form.legend.date
            }}
          >
            {Input}
          </Field>
        }
        {isDocument &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step2.country = c; }}
            onChange={value => this.onLegendChange({ country: value })}
            hint="Name of columns with country value (ISO3 code)"
            properties={{
              name: 'country',
              label: 'Country',
              type: 'text',
              default: this.state.form.legend.country
            }}
          >
            {Input}
          </Field>
        }
      </fieldset>
    );
  }
}

Step2.propTypes = {
  dataset: React.PropTypes.string,
  form: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step2;
