import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { PROVIDER_OPTIONS, FORM_ELEMENTS, FORMAT } from 'components/admin/layers/form/constants';

// Components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import Select from 'components/form/SelectInput';
import Textarea from 'components/form/TextArea';
import Checkbox from 'components/form/Checkbox';
import Code from 'components/form/Code';
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/Legend';


// Utils
import LayerManager from 'utils/layers/LayerManager';
import { capitalizeFirstLetter } from 'utils/utils';

// Constants
const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      form: props.form,
      interactionsForm: props.interactionsForm,
      layerGroups: []
    };

    // ------------------- BINDINGS -------------------------
    this.handleRefreshPreview = this.handleRefreshPreview.bind(this);
  }

  componentDidMount() {
    this.setLayerGroups();
  }

  setLayerGroups() {
    const { form } = this.props;
    const layerGroups = [{
      dataset: form.dataset,
      visible: true,
      layers: [{
        active: true,
        application: form.application,
        layerConfig: form.layerConfig,
        interactionConfig: form.interactionConfig,
        legendConfig: form.legendConfig,
        id: form.id,
        name: form.name,
        provider: form.provider,
        slug: form.slug,
        iso: form.iso,
        description: form.description
      }]
    }];
    this.setState({ layerGroups });
  }

  handleRefreshPreview() {
    this.setLayerGroups();
  }

  renderInteractionFields(data) {
    return Object.entries(data).map((item, key) => {
      const fieldType = item[0];
      const fieldValue = item[1];
      return (
        <Field
          key={data.column + key}
          onChange={value => this.props
            .editInteraction({ value, key: fieldType, field: data })}
          properties={{
            name: key,
            label: /property/.test(fieldType) ? 'Label' : capitalizeFirstLetter(fieldType),
            type: 'text',
            disabled: /column/.test(fieldType),
            required: /property/.test(fieldType),
            default: fieldValue
          }}
        >
          {Input}
        </Field>
      );
    });
  }

  render() {
    const { interactions } = this.props;
    const {
      layerGroups,
      interactionsForm
    } = this.state;

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

        <h5>Interactions</h5>

        {interactionsForm && interactionsForm.output &&
          interactionsForm.output.map((data) => {
            return (
              <section className="c-field-flex" key={data.column}>
                {this.renderInteractionFields(data)}
              </section>
            );
          })}

        <div className="c-field preview-container">
          {interactions && interactions.fields &&
          <Field
            validations={['required']}
            options={interactions.fields}
            onChange={(value, other) => this.props.modifyInteractions(value, other)}
            properties={{
              name: 'selected_columns',
              label: 'Add interactions',
              type: 'text',
              removeSelected: true,
              multi: true,
              value: interactionsForm.output ? FORMAT.options(interactionsForm.output) : [],
              default: interactionsForm.output ? FORMAT.options(interactionsForm.output) : []
            }}
          >
            {Select}
          </Field>}

        </div>

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
                className={{ color: '-dark' }}
                toggleLayerGroupVisibility={() => {}}
                setLayerGroupsOrder={() => {}}
                setLayerGroupActiveLayer={() => {}}
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
  onChangeDataset: PropTypes.func,
  modifyInteractions: PropTypes.func,
  interactions: PropTypes.object,
  interactionsForm: PropTypes.object,
  editInteraction: PropTypes.func
};

export default Step1;
