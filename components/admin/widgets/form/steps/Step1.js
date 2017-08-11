import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { toastr } from 'react-redux-toastr';

// Constants
import { FORM_ELEMENTS, CONFIG_TEMPLATE, CONFIG_TEMPLATE_OPTIONS } from 'components/admin/widgets/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import Select from 'components/form/SelectInput';
import Code from 'components/form/Code';
import Checkbox from 'components/form/Checkbox';
import WidgetEditor from 'components/widgets/WidgetEditor';
import SwitchOptions from 'components/ui/SwitchOptions';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form,
      mode: 'advanced'
    };

    // BINDINGS
    this.triggerChangeMode = this.triggerChangeMode.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  /**
   * HELPERS
   * - triggerChangeMode
  */
  triggerChangeMode(mode) {
    this.setState({ mode });
  }

  render() {
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    const editorFieldContainerClass = classnames({
      '-expanded': this.state.mode === 'editor'
    });

    return (
      <fieldset className="c-field-container">
        <fieldset className="c-field-container">
          {/* DATASET */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
            onChange={value => this.props.onChange({
              dataset: value,
              widgetConfig: {}
            })}
            validations={['required']}
            className="-fluid"
            options={this.props.datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              default: this.state.form.dataset,
              value: this.state.form.dataset,
              required: true,
              instanceId: 'selectDataset'
            }}
          >
            {Select}
          </Field>

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

          {/* PUBLISHED */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
            onChange={value => this.props.onChange({ published: value.checked })}
            properties={{
              name: 'published',
              label: 'Do you want to set this widget as published?',
              value: 'published',
              title: 'Published',
              defaultChecked: this.props.form.published,
              checked: this.props.form.published
            }}
          >
            {Checkbox}
          </Field>

        </fieldset>

        {this.state.form.dataset &&
          <fieldset className={`c-field-container ${editorFieldContainerClass}`}>
            <div className="l-row row align-right">
              <div className="column shrink">
                <SwitchOptions
                  selected={this.state.mode}
                  options={[{
                    value: 'advanced',
                    label: 'Advanced'
                  }, {
                    value: 'editor',
                    label: 'Editor'
                  }]}
                  onChange={selected => this.triggerChangeMode(selected.value)}
                />
              </div>
            </div>

            {this.state.mode === 'editor' &&
              <WidgetEditor
                dataset={this.state.form.dataset}
                mode="dataset"
                showSaveButton={false}
                onChange={(value) => { this.props.onChange({ widgetConfig: value }); }}
                onError={() => {
                  toastr.error('Error', 'This dataset doesn\'t allow editor mode');
                  this.setState({ mode: 'advanced' });
                }}
              />
            }

            {this.state.mode === 'advanced' &&
              <Field
                onChange={value => this.props.onChange({
                  widgetConfig: CONFIG_TEMPLATE[value] || {}
                })}
                options={CONFIG_TEMPLATE_OPTIONS}
                properties={{
                  name: 'template',
                  label: 'Template',
                  instanceId: 'selectTemplate'
                }}
              >
                {Select}
              </Field>
            }

            {this.state.mode === 'advanced' &&
              <Field
                ref={(c) => { if (c) FORM_ELEMENTS.elements.widgetConfig = c; }}
                onChange={value => this.props.onChange({ widgetConfig: value })}
                properties={{
                  name: 'widgetConfig',
                  label: 'Widget config',
                  default: this.state.form.widgetConfig,
                  value: this.state.form.widgetConfig
                }}
              >
                {Code}
              </Field>
            }
          </fieldset>
        }
      </fieldset>
    );
  }
}

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  datasets: PropTypes.array,
  onChange: PropTypes.func
};

export default Step1;
