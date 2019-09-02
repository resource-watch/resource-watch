import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { connect } from 'react-redux';

// Constants
import { PROVIDER_OPTIONS, FORM_ELEMENTS } from 'components/admin/data/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Code from 'components/form/Code';

import InteractionManager from '../interactions';
import LayerPreviewComponent from '../layer-preview';

class Step1 extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    user: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    layerPreview: PropTypes.object.isRequired,
    datasets: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onChangeDataset: PropTypes.func.isRequired,
    verifyLayerConfig: PropTypes.func.isRequired,
    query: PropTypes.object.isRequired
  }

  static defaultProps = {
    id: null,
    datasets: []
  }

  handleRefreshPreview = () => {
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
      verifyLayerConfig,
      query,
      form,
      id
    } = this.props;

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
              default: form.dataset || query.dataset,
              value: form.dataset || query.dataset
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
            hint={'Choose "preproduction" to see this dataset only as admin, "production" option will show it in the public site.'}
            className="-fluid"
            options={[{ label: 'Pre-production', value: 'preproduction' }, { label: 'Production', value: 'production' }]}
            onChange={value => this.props.onChange({ env: value })}
            properties={{
              name: 'env',
              label: 'Environment',
              placeholder: 'Choose an environment...',
              noResultsText: 'Please, choose an environment for this layer',
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
          <div className="c-button-container -full-width -j-end">
            <button
              type="button"
              className="c-button -primary"
              onClick={() => verifyLayerConfig()}
            >
              Verify config
            </button>
          </div>
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

        {form.provider === 'cartodb' && (
          <InteractionManager layer={form} />)}

        {form.provider !== 'cartodb' &&
          <Field
            ref={(c) => { if (c) FORM_ELEMENTS.elements.interactionConfig = c; }}
            onChange={value => this.props.onChange({ interactionConfig: value })}
            properties={{
              name: 'interactionConfig',
              label: 'Raster interactivity',
              default: form.interactionConfig
            }}
          >
            {Code}
          </Field>
        }

        <LayerPreviewComponent
          layer={form}
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

const mapStateToProps = state => ({
  user: state.user,
  query: state.routes.query
});

export default connect(mapStateToProps, null)(Step1);
