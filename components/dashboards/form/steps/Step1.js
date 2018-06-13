import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

// Constants
import { FORM_ELEMENTS } from 'components/dashboards/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
import Checkbox from 'components/form/Checkbox';

// Wysiwyg
import Wysiwyg from 'components/form/VizzWysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = { form: props.form };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  render() {
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <div>
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

          {/* SUMMARY */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.summary = c; }}
            onChange={value => this.props.onChange({ summary: value })}
            className="-fluid"
            properties={{
              name: 'summary',
              label: 'Summary',
              rows: '6',
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
              rows: '6',
              default: this.state.form.description
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
                    if (value) {
                      this.props.onChange({ photo: value });
                    } else {
                      this.props.onChange({ photo: null });
                    }
                  }}
                  className="-fluid"
                  properties={{
                    name: 'photo',
                    label: 'Photo',
                    placeholder: 'Browse file',
                    baseUrl: process.env.STATIC_SERVER_URL,
                    default: this.state.form.photo
                  }}
                >
                  {FileImage}
                </Field>
              </div>
            </div>
          </div>


          {/* PUBLISHED */}
          {!this.props.basic &&
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
              onChange={value => this.props.onChange({
                published: value.checked,
                private: !value.checked
              })}
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
          }

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.preproduction = c; }}
            onChange={value => this.props.onChange({ preproduction: value.checked })}
            properties={{
              name: 'preproduction',
              label: 'Do you want to set this dashboard as pre-production?',
              value: 'preproduction',
              title: 'Pre-production',
              defaultChecked: this.props.form.preproduction,
              checked: this.props.form.preproduction
            }}
          >
            {Checkbox}
          </Field>

          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.production = c; }}
            onChange={value => this.props.onChange({ production: value.checked })}
            properties={{
              name: 'production',
              label: 'Do you want to set this dashboard as production?',
              value: 'production',
              title: 'Production',
              defaultChecked: this.props.form.production,
              checked: this.props.form.production
            }}
          >
            {Checkbox}
          </Field>
        </fieldset>

        <fieldset className="c-field-container">
          {/* CONTENT */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.content = c; }}
            onChange={value => this.props.onChange({ content: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'content',
              label: 'Content',
              required: true,
              default: this.state.form.content,
              blocks: {
                widget: {
                  Component: WidgetBlock,
                  EditionComponent: WidgetBlockEdition,
                  icon: 'icon-widget',
                  label: 'Visualization',
                  renderer: 'modal'
                }
              },
              onUploadImage: files => new Promise((resolve, reject) => {
                const file = files[0];
                const formData = new FormData();
                formData.append('image', file);

                fetch(`${process.env.API_URL}/temporary_content_images`, {
                  method: 'POST',
                  headers: { Authorization: this.props.user.token },
                  body: formData
                })
                  .then(response => response.json())
                  .then((response) => {
                    resolve(response.url);
                  })
                  .catch((e) => {
                    toastr.error('Error', 'We couldn\'t upload the image. Try again');
                    reject(e);
                  });
              })
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
  form: PropTypes.object,
  basic: PropTypes.bool,
  user: PropTypes.object,
  onChange: PropTypes.func
};

export default connect(state => ({ user: state.user }))(Step1);
