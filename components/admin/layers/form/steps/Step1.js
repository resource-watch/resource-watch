import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { connect } from 'react-redux';

// Constants
import { PROVIDER_OPTIONS, FORM_ELEMENTS } from 'components/admin/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Code from 'components/form/Code';

import InteractionsComponent from '../interactions/interactions-component';
import LayerPreviewComponent from '../layer-preview';

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form
    };

    // ------------------- BINDINGS -------------------------
    this.handleRefreshPreview = this.handleRefreshPreview.bind(this);
  }

  handleRefreshPreview() {
    this.setLayerGroups();
  }

  layerConfigStatus(title, err) {
    const classes = classnames({
      'layer-config-status': true,
      errors: !!err
    });

    return (
      <section className={classes}>
        <h4>{title}</h4>
        {err && err.errors && <ul>{err.errors.map((e, k) => <li key={k}>{e}</li>)}</ul>}
      </section>);
  }

  render() {
    const {
      user,
      layerPreview,
      verifyLayerConfig
    } = this.props;

    const { form, id } = this.state;

    return (
      <fieldset className="c-field-container">
        {!id &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.dataset = c; }}
            onChange={value => this.props.onChangeDataset(value)}
            validations={['required']}
            options={this.props.datasets}
            properties={{
              name: 'dataset',
              label: 'Dataset',
              type: 'text',
              required: true,
              default: form.dataset
            }}
          >
            {Select}
          </Field>
        }

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
          onChange={value => this.props.onChange({ name: value })}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Title',
            type: 'text',
            required: true,
            default: form.name
          }}
        >
          {Input}
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
            defaultChecked: this.props.form.published,
            checked: this.props.form.published
          }}
        >
          {Checkbox}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.provider = c; }}
          onChange={value => this.props.onChange({ provider: value })}
          validations={['required']}
          options={PROVIDER_OPTIONS}
          properties={{
            name: 'provider',
            label: 'Provider',
            type: 'text',
            required: true,
            default: form.provider
          }}
        >
          {Select}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
          onChange={value => this.props.onChange({ description: value })}
          properties={{
            name: 'description',
            label: 'Description',
            type: 'textarea',
            default: form.description
          }}
        >
          {Textarea}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.layerConfig = c; }}
          onChange={value => this.props.onChange({ layerConfig: value })}
          properties={{
            name: 'layerConfig',
            label: 'Layer config',
            default: form.layerConfig
          }}
        >
          {Code}
        </Field>

        {layerPreview.errors &&
          this.layerConfigStatus('Layer config not valid!', layerPreview.errors)}

        {layerPreview.errors === false &&
          this.layerConfigStatus('Layer config valid')}

        {form.provider === 'cartodb' &&
          <button
            type="button"
            className="c-button -primary"
            onClick={() => verifyLayerConfig()}
          >
            Verify config
          </button>
        }

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.legendConfig = c; }}
          onChange={value => this.props.onChange({ legendConfig: value })}
          properties={{
            name: 'legendConfig',
            label: 'Legend config',
            default: form.legendConfig
          }}
        >
          {Code}
        </Field>

        <InteractionsComponent
          form={form}
        />

        <LayerPreviewComponent
          form={form}
        />

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.default = c; }}
          onChange={value => this.props.onChange({ default: value.checked })}
          option={{ label: 'Default' }}
          properties={{
            name: 'default',
            label: 'Do you want to set this layer as the default one. (Only one default layer per dataset is allowed at a time)',
            value: 'default',
            title: 'Default',
            checked: this.props.form.default
          }}
        >
          {Checkbox}
        </Field>


      </fieldset>
    );
  }
}

Step1.defaultPropTypes = {
  datasets: []
};

Step1.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  datasets: PropTypes.array,
  form: PropTypes.object,
  layerPreview: PropTypes.object,
  onChange: PropTypes.func,
  onChangeDataset: PropTypes.func,
  verifyLayerConfig: PropTypes.func
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps, null)(Step1);
