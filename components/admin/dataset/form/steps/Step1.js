import React from 'react';

import { CONNECTOR_TYPES, CONNECTOR_TYPES_DICTIONARY, FORM_ELEMENTS } from '../constants';

import Step from './step';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';

class Step1 extends Step {
  constructor(props) {
    super(props);

    this.state = {
      dataset: props.dataset,
      form: props.form
    };

    // BINDINGS
    this.onConnectorTypeChange = this.onConnectorTypeChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  onConnectorTypeChange(value) {
    const newObj = Object.assign({}, value, { provider: '' });
    this.props.onChange(newObj);
  }

  render() {
    const provider = CONNECTOR_TYPES_DICTIONARY[this.state.form.connectorType];
    return (
      <fieldset className="c-field-container">
        {!this.state.form.authorization &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.authorization = c; }}
            onChange={value => this.props.onChange({ authorization: value })}
            validations={['required']}
            properties={{
              name: 'authorization',
              label: 'Authorization token',
              type: 'text',
              required: true,
              default: this.state.form.authorization || ''
            }}
          >
            {Input}
          </Field>
        }

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
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.connectorType = c; }}
          onChange={value => this.onConnectorTypeChange({ connectorType: value })}
          validations={['required']}
          blank
          options={CONNECTOR_TYPES}
          properties={{
            name: 'connectorType',
            label: 'Connector Type',
            default: this.state.form.connectorType,
            disabled: !!this.state.dataset,
            required: true
          }}
        >
          {Select}
        </Field>

        {provider &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.provider = c; }}
            onChange={value => this.props.onChange({ provider: value })}
            validations={['required']}
            blank
            options={Object.keys(provider).map(key => (
              {
                label: provider[key].label,
                value: provider[key].value
              }
            ))}
            properties={{
              name: 'provider',
              label: 'Provider',
              default: this.state.form.provider,
              value: this.state.form.provider,
              disabled: !!this.state.dataset,
              required: true
            }}
          >
            {Select}
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
