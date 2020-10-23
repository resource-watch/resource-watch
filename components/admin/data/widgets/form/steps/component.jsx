import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WidgetEditor from '@widget-editor/widget-editor';

// Constants
import { FORM_ELEMENTS } from 'components/admin/data/widgets/form/constants';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';

// constants
import {
  WIDGET_EDITOR_COLOUR_SCHEMES,
} from 'constants/widget-editor';

// Utils
import DefaultTheme from 'utils/widgets/theme';

class AdminWidgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: props.form,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      form: {
        ...nextProps.form,
        dataset: nextProps.form.dataset || nextProps.query.dataset,
      },
    });
  }

  render() {
    const {
      id,
      user,
      query,
      datasets,
      onChange,
      onSave,
      RWAdapter,
    } = this.props;
    const { form } = this.state;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <fieldset className="c-field-container">
        <fieldset className="c-field-container">
          {/* DATASET */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
            onChange={(value) => onChange({ dataset: value })}
            validations={['required']}
            className="-fluid"
            options={datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              default: query.dataset,
              value: form.dataset || query.dataset,
              disabled: !!id,
              required: true,
              instanceId: 'selectDataset',
            }}
          >
            {Select}
          </Field>

          {(user.role === 'ADMIN') && (
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.env = c; }}
              hint={'Choose "preproduction" to see this dataset it only as admin, "production" option will show it in public site.'}
              className="-fluid"
              options={[{ label: 'Pre-production', value: 'preproduction' }, { label: 'Production', value: 'production' }]}
              onChange={(value) => onChange({ env: value })}
              properties={{
                name: 'env',
                label: 'Environment',
                placeholder: 'Choose an environment...',
                noResultsText: 'Please, type the name of the columns and press enter',
                promptTextCreator: (label) => `The name of the column is "${label}"`,
                default: 'preproduction',
                value: form.env,
              }}
            >
              {Select}
            </Field>
          )}

          {/* PUBLISHED */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
            onChange={(value) => onChange({ published: value.checked })}
            properties={{
              name: 'published',
              label: 'Do you want to set this widget as published?',
              value: 'published',
              title: 'Published',
              checked: form.published,
            }}
          >
            {Checkbox}
          </Field>

          {/* DEFAULT */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.default = c; }}
            onChange={(value) => onChange({ default: value.checked })}
            properties={{
              name: 'default',
              label: 'Do you want to set this widget as default?',
              value: 'default',
              title: 'Default',
              checked: form.default,
            }}
          >
            {Checkbox}
          </Field>

          {/* DEFAULT EDITABLE WIDGET */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.defaultEditableWidget = c; }}
            onChange={(value) => onChange({ defaultEditableWidget: value.checked })}
            properties={{
              name: 'defaultEditableWidget',
              label: 'Do you want to set this widget as the default editable widget?',
              value: 'defaultEditableWidget',
              title: 'Default editable widget',
              checked: form.defaultEditableWidget,
            }}
          >
            {Checkbox}
          </Field>

          {/* FREEZE */}
          <div className="freeze-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.freeze = c; }}
              onChange={(value) => onChange({ freeze: value.checked })}
              properties={{
                name: 'freeze',
                label: id ? '' : 'Do you want to freeze this widget?',
                value: 'freeze',
                title: 'Freeze',
                checked: form.freeze,
                // Temporarily disabled --> we need to review the implementation
                disabled: true,
              }}
            >
              {Checkbox}
            </Field>
            {(form.freeze && id) && (
              <div className="freeze-text">
                This widget has been&nbsp;
                <strong>frozen</strong>
                &nbsp;and cannot be modified...
              </div>
            )}
          </div>
        </fieldset>

        {form.dataset && (
          <WidgetEditor
            datasetId={form.dataset}
            {...(id && { widgetId: id })}
            application="rw"
            onSave={onSave}
            theme={DefaultTheme}
            adapter={RWAdapter}
            schemes={WIDGET_EDITOR_COLOUR_SCHEMES}
            authenticated
            compact={false}
          />
        )}
      </fieldset>
    );
  }
}

AdminWidgetForm.defaultProps = {
  id: null,
  datasets: [],
};

AdminWidgetForm.propTypes = {
  id: PropTypes.string,
  user: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({
    dataset: PropTypes.string,
  }).isRequired,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
  query: PropTypes.shape({
    dataset: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  RWAdapter: PropTypes.func.isRequired,
};

export default AdminWidgetForm;
