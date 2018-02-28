import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { PROVIDER_OPTIONS, FORM_ELEMENTS } from 'components/admin/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Code from 'components/form/Code';
<<<<<<< HEAD
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/legend';

// Utils
import LayerManager from 'utils/layers/LayerManager';

// Constants
const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};
=======
import InteractionsComponent from '../interactions/interactions-component';
import LayerPreviewComponent from '../layer-preview/layer-preview-component';
>>>>>>> 66bac4c38b674484797a00790903e74cbe5dbec7

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

  render() {
    return (
      <fieldset className="c-field-container">
        {!this.state.id &&
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
              default: this.state.form.dataset
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
            default: this.state.form.name
          }}
        >
          {Input}
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
            default: this.state.form.provider
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
            default: this.state.form.description
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
            default: this.state.form.layerConfig
          }}
        >
          {Code}
        </Field>

        <Field
          ref={(c) => { if (c) FORM_ELEMENTS.elements.legendConfig = c; }}
          onChange={value => this.props.onChange({ legendConfig: value })}
          properties={{
            name: 'legendConfig',
            label: 'Legend config',
            default: this.state.form.legendConfig
          }}
        >
          {Code}
        </Field>

        <InteractionsComponent
          form={this.state.form}
        />

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
            default: this.state.form.provider
          }}
        >
          {Select}
        </Field>

<<<<<<< HEAD
        <div className="c-field preview-container">
          <h5>Layer preview</h5>
          <div className="map-container">
            <Map
              LayerManager={LayerManager}
              mapConfig={MAP_CONFIG}
              layerGroups={layerGroups}
              setMapInstance={(map) => { this.map = map; }}
            />
            {layerGroups.length > 0 &&
              <Legend
                layerGroups={this.state.layerGroups}
                interaction={false}
                readonly
              />
            }
          </div>
          <div className="actions">
            <button
              type="button"
              className="c-button -primary"
              onClick={this.handleRefreshPreview}
            >
              Refresh
            </button>
          </div>
        </div>
=======
        <LayerPreviewComponent
          form={this.state.form}
        />
>>>>>>> 66bac4c38b674484797a00790903e74cbe5dbec7

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
  datasets: PropTypes.array,
  form: PropTypes.object,
  onChange: PropTypes.func,
  onChangeDataset: PropTypes.func
};

export default Step1;
