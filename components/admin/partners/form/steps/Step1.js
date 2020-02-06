import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { FORM_ELEMENTS, PARTNER_TYPES } from 'components/admin/partners/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  render() {
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <fieldset className="c-field-container">
        {/* NAME */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
          onChange={value => this.props.onChange({ name: value })}
          validations={['required']}
          className="-fluid"
          properties={{
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
            default: this.state.form.name
          }}
        >
          {Input}
        </Field>

        {/* TYPE */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements['partner-type'] = c; }}
          onChange={value => this.props.onChange({ 'partner-type': value })}
          validations={['required']}
          className="-fluid"
          options={PARTNER_TYPES}
          properties={{
            name: 'partner-type',
            label: 'Partner Type',
            default: this.state.form['partner-type'],
            value: this.state.form['partner-type'],
            required: true,
            instanceId: 'selectPartnerType'
          }}
        >
          {Select}
        </Field>

        {/* DESCRIPTION */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.summary = c; }}
          onChange={value => this.props.onChange({ summary: value })}
          className="-fluid"
          properties={{
            name: 'summary',
            label: 'Summary',
            default: this.state.form.summary
          }}
        >
          {TextArea}
        </Field>

        {/* CONTENT */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.body = c; }}
          onChange={value => this.props.onChange({ body: value })}
          className="-fluid"
          properties={{
            name: 'body',
            label: 'Body',
            default: this.state.form.body
          }}
        >
          {TextArea}
        </Field>

        {/* URL */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.website = c; }}
          onChange={value => this.props.onChange({ website: value })}
          validations={['url']}
          className="-fluid"
          properties={{
            name: 'website',
            label: 'Website',
            default: this.state.form.website
          }}
        >
          {Input}
        </Field>

        {/* CONTACT NAME */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.contact_name = c; }}
          onChange={value => this.props.onChange({ contact_name: value })}
          className="-fluid"
          properties={{
            name: 'contact_name',
            label: 'Contact name',
            default: this.state.form.contact_name
          }}
        >
          {Input}
        </Field>

        {/* CONTACT EMAIL */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.contact_email = c; }}
          onChange={value => this.props.onChange({ contact_email: value })}
          validations={['email']}
          className="-fluid"
          properties={{
            name: 'contact_email',
            label: 'Contact email',
            default: this.state.form.contact_email
          }}
        >
          {Input}
        </Field>

        {/* IMAGES */}
        <div className="c-field-row">
          <div className="row l-row">
            <div className="column small-12 medium-4">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.logo = c; }}
                onChange={(value) => {
                  this.props.onChange({ logo: value });
                }}
                validations={['required']}
                className="-fluid"
                properties={{
                  name: 'logo',
                  label: 'Logo',
                  placeholder: 'Browse file',
                  baseUrl: process.env.STATIC_SERVER_URL,
                  default: this.state.form.logo,
                  required: true
                }}
              >
                {FileImage}
              </Field>
            </div>

            <div className="column small-12 medium-4">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements['white-logo'] = c; }}
                onChange={(value) => {
                  this.props.onChange({ 'white-logo': value });
                }}
                validations={['required']}
                className="-fluid"
                properties={{
                  name: 'white-logo',
                  label: 'White logo',
                  placeholder: 'Browse file',
                  baseUrl: process.env.STATIC_SERVER_URL,
                  default: this.state.form['white-logo'],
                  required: true
                }}
              >
                {FileImage}
              </Field>
            </div>

            <div className="column small-12 medium-4">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.cover = c; }}
                onChange={(value) => {
                  this.props.onChange({ cover: value });
                }}
                validations={['required']}
                className="-fluid"
                properties={{
                  name: 'cover',
                  label: 'Cover',
                  placeholder: 'Browse file',
                  baseUrl: process.env.STATIC_SERVER_URL,
                  default: this.state.form.cover,
                  required: true
                }}
              >
                {FileImage}
              </Field>
            </div>

            <div className="column small-12 medium-4">
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.icon = c; }}
                onChange={(value) => {
                  this.props.onChange({ icon: value });
                }}
                validations={['required']}
                className="-fluid"
                properties={{
                  name: 'icon',
                  label: 'Icon',
                  placeholder: 'Browse file',
                  baseUrl: process.env.STATIC_SERVER_URL,
                  default: this.state.form.icon,
                  required: true
                }}
              >
                {FileImage}
              </Field>
            </div>
          </div>
        </div>

        {/* FEATURED */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.featured = c; }}
          onChange={value => this.props.onChange({ featured: value.checked })}
          properties={{
            name: 'featured',
            label: 'Do you want to set this partner as featured?',
            value: 'featured',
            title: 'Featured',
            defaultChecked: this.props.form.featured,
            checked: this.props.form.featured
          }}
        >
          {Checkbox}
        </Field>

        {/* PUBLISHED */}
        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
          onChange={value => this.props.onChange({ published: value.checked })}
          properties={{
            name: 'published',
            label: 'Do you want to set this partner as published?',
            value: 'published',
            title: 'Published',
            defaultChecked: this.props.form.published,
            checked: this.props.form.published
          }}
        >
          {Checkbox}
        </Field>

      </fieldset>
    );
  }
}

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  onChange: PropTypes.func
};

export default Step1;
