import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import isEmpty from 'lodash/isEmpty';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import FileImage from 'components/form/FileImage';
import Checkbox from 'components/form/Checkbox';
import TemplateSelector from 'components/dashboards/template-selector';

// Wysiwyg
import Wysiwyg from 'components/form/VizzWysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition';
import MiniExploreBlock from 'components/wysiwyg/mini-explore';

// constants
import { FORM_ELEMENTS } from 'components/dashboards/form/constants';
import { TEMPLATES } from 'components/dashboards/template-selector/constants';

class Step1 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        ...props.form,
        content: TEMPLATES[0].content,
      },
    };
  }

  componentDidMount() {
    const { child: wysiwyg } = FORM_ELEMENTS.elements.content;
    const { form } = this.props;

    if (!isEmpty(form.content)) {
      wysiwyg.setValue(form.content);
    } else {
      wysiwyg.setValue(JSON.stringify(TEMPLATES[0].content));
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  static onChangeTemplate(nextTemplate) {
    const { child: wysiwyg } = FORM_ELEMENTS.elements.content;
    const { content } = nextTemplate;

    wysiwyg.setValue(JSON.stringify(content));
  }

  render() {
    const {
      mode, onChange, form, basic, user,
    } = this.props;
    const { form: stateForm } = this.state;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <div>
        <fieldset className="c-field-container">
          {/* NAME */}
          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.name = c;
            }}
            onChange={(value) => onChange({ name: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'name',
              label: 'Name',
              type: 'text',
              required: true,
              default: stateForm.name,
            }}
          >
            {Input}
          </Field>

          {/* SUMMARY */}
          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.summary = c;
            }}
            onChange={(value) => onChange({ summary: value })}
            className="-fluid"
            properties={{
              name: 'summary',
              label: 'Summary',
              rows: '6',
              default: stateForm.summary,
            }}
          >
            {TextArea}
          </Field>

          {/* DESCRIPTION */}
          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.description = c;
            }}
            onChange={(value) => onChange({ description: value })}
            className="-fluid"
            properties={{
              name: 'description',
              label: 'Description',
              rows: '6',
              default: stateForm.description,
            }}
          >
            {TextArea}
          </Field>

          {/* THUMBNAIL */}
          <div className="c-field-row">
            <div className="row l-row">
              <div className="column small-12 medium-6">
                <Field
                  ref={(c) => {
                    if (c) FORM_ELEMENTS.elements.photo = c;
                  }}
                  onChange={(value) => {
                    if (value) {
                      onChange({ photo: value });
                    } else {
                      onChange({ photo: null });
                    }
                  }}
                  className="-fluid"
                  properties={{
                    name: 'photo',
                    label: 'Photo',
                    placeholder: 'Browse file',
                    default: stateForm.photo,
                  }}
                >
                  {FileImage}
                </Field>
              </div>
            </div>
          </div>

          {/* PUBLISHED */}
          {!basic
          && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.published = c;
              }}
              onChange={(value) => onChange({
                published: value.checked,
                private: !value.checked,
              })}
              properties={{
                name: 'published',
                label: 'Do you want to set this dasboard as published?',
                value: 'published',
                title: 'Published',
                defaultChecked: form.published,
                checked: form.published,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {!basic
          && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.preproduction = c;
              }}
              onChange={(value) => onChange({ preproduction: value.checked })}
              properties={{
                name: 'preproduction',
                label: 'Do you want to set this dashboard as pre-production?',
                value: 'preproduction',
                title: 'Pre-production',
                defaultChecked: form.preproduction,
                checked: form.preproduction,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {!basic
          && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.production = c;
              }}
              onChange={(value) => onChange({ production: value.checked })}
              properties={{
                name: 'production',
                label: 'Do you want to set this dashboard as production?',
                value: 'production',
                title: 'Production',
                defaultChecked: form.production,
                checked: form.production,
              }}
            >
              {Checkbox}
            </Field>
          )}

          {/* IS-HIGHLIGHTED */}
          {!basic
          && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements['is-highlighted'] = c;
              }}
              onChange={(value) => onChange({ 'is-highlighted': value.checked })}
              properties={{
                name: 'is-highlighted',
                label: 'Highlight in Dashboards gallery',
                value: 'is-highlighted',
                title: 'Is highlighted',
                defaultChecked: form['is-highlighted'],
                checked: form['is-highlighted'],
              }}
            >
              {Checkbox}
            </Field>
          )}

          {/* IS-FEATURED */}
          {!basic
          && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements['is-featured'] = c;
              }}
              onChange={(value) => onChange({ 'is-featured': value.checked })}
              properties={{
                name: 'is-featured',
                label: 'Add to Featured dashboards',
                value: 'is-featured',
                title: 'Featured',
                defaultChecked: form['is-featured'],
                checked: form['is-featured'],
              }}
            >
              {Checkbox}
            </Field>
          )}
        </fieldset>

        <fieldset className="c-field-container">
          {/* templates */}
          {mode === 'new' && (
            <TemplateSelector onChange={Step1.onChangeTemplate} />)}

          {/* CONTENT */}
          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.content = c;
            }}
            onChange={(value) => onChange({ content: value })}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'content',
              label: 'Content',
              required: true,
              default: stateForm.content,
              blocks: {
                widget: {
                  Component: WidgetBlock,
                  EditionComponent: WidgetBlockEdition,
                  icon: 'icon-widget',
                  label: 'Visualization',
                  renderer: 'modal',
                },
                'mini-explore': {
                  Component: MiniExploreBlock,
                },
              },
              onUploadImage: (files) => new Promise((resolve, reject) => {
                const file = files[0];
                const formData = new FormData();
                formData.append('image', file);

                fetch(`${process.env.NEXT_PUBLIC_WRI_API_URL}/v1/temporary_content_image`, {
                  method: 'POST',
                  headers: { Authorization: user.token },
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((response) => {
                    resolve(response.url);
                  })
                  .catch((e) => {
                    toastr.error('Error', 'We couldn\'t upload the image. Try again');
                    reject(e);
                  });
              }),
            }}
          >
            {Wysiwyg}
          </Field>
        </fieldset>
      </div>
    );
  }
}

Step1.defaultProps = {
  form: {},
  basic: false,
  mode: 'new',
};
Step1.propTypes = {
  form: PropTypes.shape({
    content: PropTypes.string,
    'is-featured': PropTypes.bool,
    'is-highlighted': PropTypes.bool,
    production: PropTypes.string,
    preproduction: PropTypes.string,
    published: PropTypes.bool,
    photo: PropTypes.string,
    description: PropTypes.string,
  }),
  basic: PropTypes.bool,
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  mode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Step1;
