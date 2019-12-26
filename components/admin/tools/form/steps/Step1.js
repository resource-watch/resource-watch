import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { FORM_ELEMENTS } from 'components/admin/tools/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
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
      <div>
        <fieldset className="c-field-container">
          {/* TITLE */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
            onChange={value => this.props.onChange({ title: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'title',
              label: 'Title',
              type: 'text',
              required: true,
              default: this.state.form.title
            }}
          >
            {Input}
          </Field>

          {/* SUMMARY */}
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

          {/* DESCRIPTION */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
            onChange={value => this.props.onChange({ description: value })}
            className="-fluid"
            properties={{
              name: 'description',
              label: 'Description',
              default: this.state.form.description
            }}
          >
            {TextArea}
          </Field>

          {/* URL */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.url = c; }}
            onChange={value => this.props.onChange({ url: value })}
            validations={['url']}
            className="-fluid"
            properties={{
              name: 'url',
              label: 'Url',
              type: 'text',
              default: this.state.form.url
            }}
          >
            {Input}
          </Field>

          {/* THUMBNAIL */}
          <div className="c-field-row">
            <div className="row l-row">
              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.thumbnail = c; }}
                  onChange={(value) => {
                    this.props.onChange({ thumbnail: value });
                  }}
                  validations={['required']}
                  className="-fluid"
                  properties={{
                    name: 'thumbnail',
                    label: 'Photo',
                    placeholder: 'Browse file',
                    default: this.state.form.thumbnail,
                    required: true
                  }}
                >
                  {FileImage}
                </Field>
              </div>
            </div>
          </div>

          {/* PUBLISHED */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
            onChange={value => this.props.onChange({ published: value.checked })}
            properties={{
              name: 'published',
              label: 'Do you want to set this dasboard as published?',
              value: 'published',
              title: 'Published',
              defaultChecked: this.props.form.published,
              checked: this.props.form.published
            }}
          >
            {Checkbox}
          </Field>
        </fieldset>
      </div>
    );
  }
}

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  onChange: PropTypes.func
};

export default Step1;
