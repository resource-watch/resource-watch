import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { toastr } from 'react-redux-toastr';

// Constants
import { FORM_ELEMENTS, CONFIG_TEMPLATE, CONFIG_TEMPLATE_OPTIONS } from 'components/admin/widgets/form/constants';

// Redux
import { connect } from 'react-redux';
import { setTitle } from 'components/widgets/editor/redux/widgetEditor';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import TextArea from 'components/form/TextArea';
import Select from 'components/form/SelectInput';
import Code from 'components/form/Code';
import Checkbox from 'components/form/Checkbox';
import WidgetEditor from 'components/widgets/editor/WidgetEditor';
import SwitchOptions from 'components/ui/SwitchOptions';
import VegaChart from 'components/widgets/charts/VegaChart';
import Spinner from 'components/ui/Spinner';

// utils
import ChartTheme from 'utils/widgets/theme';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form,
      loadingVegaChart: true
    };

    // ------------------- BINDINGS ---------------------------
    this.triggerChangeMode = this.triggerChangeMode.bind(this);
    this.triggerToggleLoadingVegaChart = this.triggerToggleLoadingVegaChart.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  /**
   * HELPERS
   * - triggerChangeMode
  */
  triggerChangeMode(mode) {
    if (mode === 'editor') {
      toastr.confirm('By switching you will start editing from scratch', {
        onOk: () => {
          this.props.onModeChange(mode);
        },
        onCancel: () => {
          this.props.onModeChange(this.props.mode);
        }
      });
    } else {
      toastr.confirm('By switching you can edit your current widget but you can\'t go back to the editor', {
        onOk: () => {
          this.props.onModeChange(mode);
        },
        onCancel: () => {
          this.props.onModeChange(this.props.mode);
        }
      });
    }
  }

  triggerToggleLoadingVegaChart(loading) {
    this.setState({ loadingVegaChart: loading });
  }

  render() {
    const { id, loadingVegaChart } = this.state;
    const { widgetEditor, showEditor } = this.props;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    const editorFieldContainerClass = classnames({
      '-expanded': this.props.mode === 'editor'
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
              disabled: !!id,
              required: true,
              instanceId: 'selectDataset'
            }}
          >
            {Select}
          </Field>

          {/* NAME */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
            onChange={value => this.props.setTitle(value)}
            validations={['required']}
            className="-fluid"
            properties={{
              name: 'name',
              label: 'Name',
              type: 'text',
              required: true,
              default: widgetEditor.title || '',
              value: widgetEditor.title || ''
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

          {/* DEFAULT */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.default = c; }}
            onChange={value => this.props.onChange({ default: value.checked })}
            properties={{
              name: 'default',
              label: 'Do you want to set this widget as default?',
              value: 'default',
              title: 'Default',
              defaultChecked: this.props.form.default,
              checked: this.props.form.default
            }}
          >
            {Checkbox}
          </Field>

          {/* DEFAULT EDITABLE WIDGET */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.defaultEditableWidget = c; }}
            onChange={value => this.props.onChange({ defaultEditableWidget: value.checked })}
            properties={{
              name: 'defaultEditableWidget',
              label: 'Do you want to set this widget as the default editable widget?',
              value: 'defaultEditableWidget',
              title: 'Default editable widget',
              defaultChecked: this.props.form.defaultEditableWidget,
              checked: this.props.form.defaultEditableWidget
            }}
          >
            {Checkbox}
          </Field>

          {/* FREEZE */}
          <div className="freeze-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.freeze = c; }}
              onChange={value => this.props.onChange({ freeze: value.checked })}
              properties={{
                name: 'freeze',
                label: this.props.id ? '' : 'Do you want to freeze this widget?',
                value: 'freeze',
                title: 'Freeze',
                defaultChecked: this.props.form.freeze,
                checked: this.props.form.freeze,
                disabled: this.props.id && this.props.form.freeze
              }}
            >
              {Checkbox}
            </Field>
            {this.props.form.freeze && this.props.mode === 'new' &&
              <div className="freeze-text">
                This widget has been <strong>frozen</strong> and cannot be modified...
              </div>
            }
          </div>
        </fieldset>

        {this.state.form.dataset && showEditor &&
          <fieldset className={`c-field-container ${editorFieldContainerClass}`}>
            <div className="l-row row align-right">
              <div className="column shrink">
                <SwitchOptions
                  selected={this.props.mode}
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

            {this.props.mode === 'editor' &&
              <WidgetEditor
                dataset={this.state.form.dataset}
                mode="dataset"
                showSaveButton={false}
                onChange={(value) => { this.props.onChange({ widgetConfig: value }); }}
              />
            }

            {this.props.mode === 'advanced' &&
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

            {this.props.mode === 'advanced' &&
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
        {!showEditor && this.state.form.dataset &&
          <div>
            <Spinner isLoading={loadingVegaChart} className="-light -relative" />
            <VegaChart
              data={this.state.form.widgetConfig}
              theme={ChartTheme()}
              showLegend
              reloadOnResize
              toggleLoading={this.triggerToggleLoadingVegaChart}
            />
          </div>
        }
      </fieldset>
    );
  }
}

Step1.defaultProps = {
  showEditor: true
};

Step1.propTypes = {
  id: PropTypes.string,
  form: PropTypes.object,
  mode: PropTypes.string,
  datasets: PropTypes.array,
  onChange: PropTypes.func,
  onModeChange: PropTypes.func,
  showEditor: PropTypes.bool,
  // REDUX
  widgetEditor: PropTypes.object,
  setTitle: PropTypes.func
};

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

const mapDispatchToProps = dispatch => ({
  setTitle: title => dispatch(setTitle(title))
});

export default connect(mapStateToProps, mapDispatchToProps)(Step1);
