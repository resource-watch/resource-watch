import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WidgetEditor from '@widget-editor/widget-editor';
import RwAdapter from '@widget-editor/rw-adapter';

// Redux
import { connect } from 'react-redux';

// Constants
import { FORM_ELEMENTS } from 'components/admin/data/widgets/form/constants';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';

// Utils
import DefaultTheme from 'utils/widgets/theme';

class Step1 extends Component {
  static propTypes = {
    id: PropTypes.string,
    user: PropTypes.object.isRequired,
    form: PropTypes.object,
    datasets: PropTypes.array,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    query: PropTypes.object.isRequired
  };

  state = {
    id: this.props.id,
    form: this.props.form,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {    
    this.setState({
      form: {
        ...nextProps.form,
        dataset: nextProps.form.dataset || nextProps.query.dataset
      }
    });
  }

  render() {
    const { id } = this.state;
    const { user, query } = this.props;
    
    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    return (
      <fieldset className="c-field-container">
        <fieldset className="c-field-container">
          {/* DATASET */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
            onChange={value => this.props.onChange({
              dataset: value
            })}
            validations={['required']}
            className="-fluid"
            options={this.props.datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              default: query.dataset,
              value: this.state.form.dataset || query.dataset,
              disabled: !!id,
              required: true,
              instanceId: 'selectDataset'
            }}
          >
            {Select}
          </Field>

          {(user.role === 'ADMIN') &&
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.env = c; }}
              hint={'Choose "preproduction" to see this dataset it only as admin, "production" option will show it in public site.'}
              className="-fluid"
              options={[{ label: 'Pre-production', value: 'preproduction' }, { label: 'Production', value: 'production' }]}
              onChange={value => this.props.onChange({ env: value })}
              properties={{
                name: 'env',
                label: 'Environment',
                placeholder: 'Type the columns...',
                noResultsText: 'Please, type the name of the columns and press enter',
                promptTextCreator: label => `The name of the column is "${label}"`,
                default: 'preproduction',
                value: this.props.form.env
              }}
            >
              {Select}
            </Field>}

          {/* PUBLISHED */}
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.published = c; }}
            onChange={value => this.props.onChange({ published: value.checked })}
            properties={{
              name: 'published',
              label: 'Do you want to set this widget as published?',
              value: 'published',
              title: 'Published',
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
                checked: this.props.form.freeze,
                // Temporarily disabled --> we need to review the implementation
                disabled: true
              }}
            >
              {Checkbox}
            </Field>
            {this.props.form.freeze && this.props.id &&
              <div className="freeze-text">
                This widget has been <strong>frozen</strong> and cannot be modified...
              </div>
            }
          </div>
        </fieldset>

        {this.state.form.dataset &&
          <WidgetEditor 
            datasetId={this.state.form.dataset}
            {...(id && { widgetId: id })}
            application="rw"
            onSave={this.props.onSave}
            theme={DefaultTheme}
            adapter={RwAdapter}
            authenticated={true}
            compact={false}
          />
        }
      </fieldset>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  query: state.routes.query
});

export default connect(mapStateToProps, null)(Step1);
