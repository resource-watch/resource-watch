import React from 'react';

import { FORM_ELEMENTS } from '../constants';

import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';

class Step1 extends React.Component {
  render() {
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
            default: this.props.form.name
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.queryUrl = c; }}
          onChange={value => this.props.onChange({ queryUrl: value })}
          properties={{
            name: 'queryUrl',
            label: 'Query url',
            type: 'text',
            default: this.props.form.queryUrl
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.description = c; }}
          onChange={value => this.props.onChange({ description: value })}
          properties={{
            name: 'description',
            label: 'Description',
            type: 'textarea',
            rows: '6',
            default: this.props.form.description
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.authors = c; }}
          onChange={value => this.props.onChange({ authors: value })}
          properties={{
            name: 'authors',
            label: 'Authors',
            type: 'text',
            default: this.props.form.authors
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.source = c; }}
          onChange={value => this.props.onChange({ source: value })}
          properties={{
            name: 'source',
            label: 'Source',
            type: 'text',
            default: this.props.form.source
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.sourceUrl = c; }}
          onChange={value => this.props.onChange({ sourceUrl: value })}
          validations={['url']}
          properties={{
            name: 'sourceUrl',
            label: 'Source url',
            type: 'text',
            default: this.props.form.sourceUrl
          }}
        >
          {Input}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.step1.default = c; }}
          onChange={value => this.props.onChange({ default: value.checked })}
          validations={['required']}
          properties={{
            name: 'default',
            label: 'Default',
            value: 'default',
            title: 'Do you want to set this widget as the default one. (Only one default widget per dataset is allowed at a time)',
            checked: this.props.form.default
          }}
        >
          {Checkbox}
        </Field>

      </fieldset>
    );
  }
}

Step1.propTypes = {
  form: React.PropTypes.object,
  onChange: React.PropTypes.func
};

export default Step1;
