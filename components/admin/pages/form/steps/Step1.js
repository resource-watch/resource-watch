import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { FORM_ELEMENTS } from 'components/admin/pages/form/constants';

// Components
import Select from 'components/form/SelectInput';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
import Checkbox from 'components/form/Checkbox';
import Wysiwyg from 'components/form/Wysiwyg';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  render() {
    const { onChange } = this.props;
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <div>
        <fieldset className="c-field-container">
          {/* TITLE */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
            onChange={(value) => onChange({ title: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              default: this.state.form.title,
            }}
          >
            {Input}
          </Field>

          {/* SUMMARY */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.summary = c; }}
            onChange={(value) => onChange({ summary: value })}
            className="-fluid"
            properties={{
              name: 'summary',
              label: 'Summary',
              default: this.state.form.summary,
            }}
          >
            {TextArea}
          </Field>

          {/* DESCRIPTION */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
            onChange={(value) => onChange({ description: value })}
            className="-fluid"
            properties={{
              name: 'description',
              label: 'Description',
              default: this.state.form.description,
            }}
          >
            {TextArea}
          </Field>

          {/* THUMBNAIL */}
          <div className="c-field-row">
            <div className="row l-row">
              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.photo = c; }}
                  onChange={(value) => {
                    onChange({ photo: value });
                  }}
                  validations={['required']}
                  className="-fluid"
                  properties={{
                    name: 'photo',
                    label: 'Photo',
                    placeholder: 'Browse file',
                    default: this.state.form.photo,
                    required: true,
                  }}
                >
                  {FileImage}
                </Field>
              </div>
            </div>
          </div>

          {/* ENVIRONMENT */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.env = c; }}
            className="-fluid"
            options={[
              { label: 'Staging', value: 'staging' },
              { label: 'Preproduction', value: 'preproduction' },
              { label: 'Production', value: 'production' },
            ]}
            onChange={(value) => this.props.onChange({ env: value })}
            properties={{
              name: 'env',
              label: 'Environment',
              placeholder: 'Choose an environment...',
              noResultsText: 'Please, choose an environment for this page',
              default: process.env.NEXT_PUBLIC_API_ENV,
              value: this.props.form.env,
            }}
          >
            {Select}
          </Field>

          {/* PUBLISHED */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
            onChange={(value) => onChange({ published: value.checked })}
            properties={{
              name: 'published',
              label: 'Do you want to set this dasboard as published?',
              value: 'published',
              title: 'Published',
              defaultChecked: this.props.form.published,
              checked: this.props.form.published,
            }}
          >
            {Checkbox}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          {/* CONTENT */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.content = c; }}
            onChange={(value) => onChange({ content: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'content',
              label: 'Content',
              type: 'text',
              required: true,
              default: this.state.form.content,
            }}
          >
            {Wysiwyg}
          </Field>
        </fieldset>
      </div>
    );
  }
}

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  onChange: PropTypes.func,
};

export default Step1;
