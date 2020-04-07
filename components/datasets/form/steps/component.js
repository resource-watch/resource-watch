import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import compact from 'lodash/compact';

// Constants
import {
  PROVIDER_TYPES_DICTIONARY,
  FORM_ELEMENTS,
  DATASET_TYPES
} from 'components/datasets/form/constants';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import File from 'components/form/File';
import Select from 'components/form/SelectInput';
import Checkbox from 'components/form/Checkbox';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import Modal from 'components/modal/modal-component';
import TrySubscriptionModal from 'components/datasets/form/try-subscription-modal';
import SortingLayerManager from '../sorting-layer-manager';

class Step1 extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    dataDataset: PropTypes.object,
    form: PropTypes.object,
    columns: PropTypes.array,
    loadingColumns: PropTypes.bool,
    basic: PropTypes.bool,
    authorization: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    sortedLayers: PropTypes.array,
    user: PropTypes.object.isRequired
  };

  static defaultProps = {
    dataDataset: null,
    sortedLayers: []
  };

  state = {
    dataset: this.props.dataset,
    dataDataset: this.props.dataDataset,
    form: this.props.form,
    carto: {},
    subscribableSelected: this.props.form.subscribable.length > 0,
    activeSubscriptionModal: null
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.form });
  }

  onCartoFieldsChange = () => {
    const { cartoAccountUsername, tableName } = this.state.carto;
    const connectorUrl = `https://${cartoAccountUsername}.carto.com/tables/${tableName}/public`;

    this.props.onChange({ connectorUrl });
  };

  onLegendChange(obj) {
    const legend = Object.assign({}, this.props.form.legend, obj);
    this.props.onChange({ legend });
  }

  onSubscribableChange(obj) {
    let { subscribable } = this.props.form;

    subscribable = subscribable.map((s) => {
      if (s.id === obj.id) {
        return Object.assign({}, s, obj);
      }
      return s;
    });

    this.props.onChange({ subscribable });
  }

  onSubscribableCheckboxChange(checked) {
    this.setState({ subscribableSelected: checked });
    if (checked) {
      this.props.onChange({ subscribable: [{ type: '', value: '', id: 0 }] });
    } else {
      this.props.onChange({ subscribable: [] });
    }
  }

  onToggleSubscribableModal(id) {
    this.setState({ activeSubscriptionModal: id });
  }

  setProviderOptions() {
    const { basic, dataset } = this.props;

    const options = Object.keys(PROVIDER_TYPES_DICTIONARY).map((key) => {
      if (basic && !dataset) {
        if (PROVIDER_TYPES_DICTIONARY[key].basic) {
          return {
            label: PROVIDER_TYPES_DICTIONARY[key].label,
            value: PROVIDER_TYPES_DICTIONARY[key].value
          };
        }

        return null;
      }

      return {
        label: PROVIDER_TYPES_DICTIONARY[key].label,
        value: PROVIDER_TYPES_DICTIONARY[key].value
      };
    });

    return basic ? compact(options) : options;
  }

  handleRemoveSubscription(id) {
    let { subscribable } = this.state.form;
    subscribable = subscribable.filter(s => s.id !== id);

    this.props.onChange({ subscribable });
  }

  handleAddSubscription = () => {
    const { subscribable } = this.state.form;
    subscribable.push({ type: '', value: '', id: Date.now() });
    this.props.onChange({ subscribable });
  };

  handleSortLayer = (layers) => {
    const { dataDataset: { applicationConfig } } = this.state;
    const { onChange } = this.props;

    onChange({
      applicationConfig: {
        ...applicationConfig,
        [process.env.APPLICATIONS]: {
          ...(applicationConfig && applicationConfig[process.env.APPLICATIONS]),
          layerOrder: layers.map(_layer => _layer.id)
        }
      }
    });
  };

  renderMainDateOptions(option) {
    return (
      <div>
        {option.value}{' '}
        {option.type && typeof option.type === 'string' ? (
          <small className="_right">{option.type}</small>
        ) : null}
      </div>
    );
  }

  render() {
    const { user, columns, loadingColumns, basic, sortedLayers, authorization } = this.props;
    const { dataset, subscribableSelected } = this.state;
    const { provider, columnFields, application } = this.state.form;

    // Reset FORM_ELEMENTS
    FORM_ELEMENTS.elements = {};

    const isCarto = provider === 'cartodb';
    const isGee = provider === 'gee';
    const isNextGDDP = provider === 'nexgddp';
    const isFeatureservice = provider === 'featureservice';
    const isJson = provider === 'json';
    const isCsv = provider === 'csv';
    const isTsv = provider === 'tsv';
    const isXml = provider === 'xml';
    const isWMS = provider === 'wms';
    const isDocument = isJson || isXml || isCsv || isTsv;

    const dateColumns = columns.map(f => ({ label: f.name, value: f.name, type: f.type }));
    const columnFieldsOptions = (columnFields || []).map(f => ({ label: f, value: f }));

    return (
      <div>
        <fieldset className="c-field-container">
          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.env = c;
              }}
              hint={
                'Choose "preproduction" to see this dataset it only as admin, "production" option will show it in public site.'
              }
              className="-fluid"
              options={[
                { label: 'Pre-production', value: 'preproduction' },
                { label: 'Production', value: 'production' }
              ]}
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
            </Field>
          )}

          {user.role === 'ADMIN' && !basic && !!dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.applications = c;
              }}
              className="-fluid"
              properties={{
                name: 'applications',
                label: 'Applications',
                disabled: true,
                readOnly: true,
                default: application,
                value: application
              }}
            >
              {Input}
            </Field>
          )}

          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.published = c;
              }}
              onChange={value => this.props.onChange({ published: value.checked })}
              validations={['required']}
              properties={{
                name: 'published',
                label: 'Do you want to set this dataset as published?',
                value: 'published',
                title: 'Published',
                defaultChecked: !dataset ? user.role === 'ADMIN' : this.props.form.published
              }}
            >
              {Checkbox}
            </Field>
          )}

          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.protected = c;
              }}
              onChange={value => this.props.onChange({ protected: value.checked })}
              validations={['required']}
              properties={{
                name: 'protected',
                label: 'Do you want to set this dataset as protected?',
                value: 'protected',
                title: 'Protected',
                defaultChecked: this.props.form.protected
              }}
            >
              {Checkbox}
            </Field>
          )}

          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.isHighlighted = c;
              }}
              onChange={value => this.props.onChange({ applicationConfig: { rw: { highlighted: value.checked } } })}
              properties={{
                name: 'isHighlighted',
                label: 'Do you want to set this dataset as highlighted?',
                value: this.state.form.applicationConfig && this.state.form.applicationConfig.rw &&
                  this.state.form.applicationConfig.rw.highlighted,
                title: 'Highlighted',
                defaultChecked: !dataset ? user.role === 'ADMIN' :
                  this.props.form.applicationConfig && this.props.form.applicationConfig.rw
                  && this.props.form.applicationConfig.rw.highlighted
              }}
            >
              {Checkbox}
            </Field>
          )}

          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.name = c;
            }}
            onChange={value => this.props.onChange({ name: value })}
            validations={['required']}
            className="-fluid"
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
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.subtitle = c;
            }}
            onChange={value => this.props.onChange({ subtitle: value })}
            className="-fluid"
            properties={{
              name: 'subtitle',
              label: 'Subtitle',
              type: 'text',
              default: this.state.form.subtitle
            }}
          >
            {Input}
          </Field>

          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.type = c;
              }}
              onChange={(value) => {
                this.props.onChange({
                  type: value,
                  ...(value === 'raster' && { geoInfo: true })
                });
              }}
              className="-fluid"
              validations={['required']}
              options={DATASET_TYPES}
              hint={`
                <ul>
                  <li>Tabular: Dataset contains table formatted data. Providers available: Carto, Gee, Feature Service, csv, json tsv and xml</li>
                  <li>Raster: Dataset is an image. Only Google Earth Engine, wms and Carto connectors can hold raster data</li>
                </ul>
              `}
              properties={{
                name: 'type',
                label: 'Type',
                default: this.state.form.type,
                value: this.state.form.type,
                disabled: !!this.state.dataset,
                required: true,
                instanceId: 'selectType'
              }}
            >
              {Select}
            </Field>
          )}

          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.geoInfo = c;
            }}
            onChange={value => this.props.onChange({ geoInfo: value.checked })}
            validations={['required']}
            properties={{
              name: 'geoInfo',
              label:
                'Does this dataset contain geographical features such as points, polygons or lines?',
              value: 'geoInfo',
              title: 'Yes',
              disabled: this.state.form.type === 'raster',
              defaultChecked: this.props.form.geoInfo
            }}
          >
            {Checkbox}
          </Field>

          <Field
            ref={(c) => {
              if (c) FORM_ELEMENTS.elements.provider = c;
            }}
            onChange={(value) => {
              this.props.onChange({
                provider: value,
                connectorUrl: '',
                legend: {
                  lat: undefined,
                  long: undefined,
                  date: [],
                  country: []
                },
                connectorType: PROVIDER_TYPES_DICTIONARY[value]
                  ? PROVIDER_TYPES_DICTIONARY[value].connectorType
                  : null,
                columnFields: null
              });
            }}
            className="-fluid"
            validations={['required']}
            options={this.setProviderOptions()}
            properties={{
              name: 'provider',
              label: 'Provider',
              default: this.state.form.provider,
              value: this.state.form.provider,
              disabled: !!this.state.dataset,
              required: true,
              instanceId: 'selectProvider'
            }}
          >
            {Select}
          </Field>

          {/*
           *****************************************************
           ****************** CARTODB FIELDS * ***************
           *****************************************************
           */}
          {isCarto && !dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.cartoAccountUsername = c;
              }}
              onChange={(value) => {
                this.setState(
                  {
                    carto: {
                      ...this.state.carto,
                      cartoAccountUsername: value
                    }
                  },
                  () => {
                    this.onCartoFieldsChange('cartoAccountUsername', value);
                  }
                );
              }}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'cartoAccountUsername',
                label: 'Carto account username',
                type: 'text',
                default: this.state.form.cartoAccountUsername,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {isCarto && !dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={(value) => {
                this.setState(
                  {
                    carto: {
                      ...this.state.carto,
                      tableName: value
                    }
                  },
                  () => {
                    this.onCartoFieldsChange('tableName', value);
                  }
                );
              }}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'tableName',
                label: 'Table name',
                type: 'text',
                default: this.state.form.tableName,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {isCarto && !!dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'connector Url',
                type: 'text',
                default: this.state.form.connectorUrl,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** GEE FIELDS * ***************
           *****************************************************
           */}
          {isGee && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={value => this.props.onChange({ tableName: value })}
              validations={['required']}
              className="-fluid"
              hint="Please add fusion table (ft:id) or an image. Example: projects/wri-datalab/HansenComposite_14-15`"
              properties={{
                name: 'tableName',
                label: 'Asset id',
                type: 'text',
                default: this.state.form.tableName,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** NEXTGDDP FIELDS * ***************
           *****************************************************
           */}
          {isNextGDDP && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.tableName = c;
              }}
              onChange={value => this.props.onChange({ tableName: value })}
              validations={['required']}
              className="-fluid"
              hint="Please verify that the scenario and model is already incorporated in Rasdaman. Example: scenario/model"
              properties={{
                name: 'tableName',
                label: 'Table name',
                type: 'text',
                default: this.state.form.tableName,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** FEATURE SERVICE ****************
           *****************************************************
           */}
          {isFeatureservice && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={value => this.props.onChange({ connectorUrl: value })}
              validations={['required', 'url']}
              className="-fluid"
              hint="Example: http://gis-gfw.wri.org/arcgis/rest/services/prep/nex_gddp_indicators/MapServer/6?f=pjson"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint',
                type: 'text',
                default: this.state.form.connectorUrl,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** WMS ****************
           *****************************************************
           */}
          {isWMS && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={value => this.props.onChange({ connectorUrl: value })}
              validations={['required', 'url']}
              className="-fluid"
              hint="This connector will only display the data as a wms map layer. The data will not be available through queries."
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint',
                type: 'text',
                default: this.state.form.connectorUrl,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {/*
           *****************************************************
           ****************** SUBSCRIBABLE ****************
           *****************************************************
           */}

          {user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.subscribable = c;
              }}
              onChange={value => this.onSubscribableCheckboxChange(value.checked)}
              properties={{
                name: 'subscribable',
                title: 'Subscribable',
                checked: Object.keys(this.state.form.subscribable).length > 0
              }}
            >
              {Checkbox}
            </Field>
          )}

          {subscribableSelected && this.state.form.subscribable.length && (
            <h3>Subscriptions ({this.state.form.subscribable.length})</h3>
          )}

          {subscribableSelected && (
            <div>
              {this.state.form.subscribable.map(elem => (
                <div className="c-field-row subscription-container" key={elem.id}>
                  <div className="l-row row">
                    <div className="column small-12">
                      <Field
                        ref={(c) => {
                          if (c) FORM_ELEMENTS.elements.subscribableType = c;
                        }}
                        onChange={type =>
                          this.onSubscribableChange({
                            type,
                            id: elem.id
                          })
                        }
                        validations={[
                          'required',
                          {
                            type: 'unique',
                            value: elem.type,
                            default: elem.type,
                            condition: 'type',
                            data: this.state.form.subscribable
                          }
                        ]}
                        className="-fluid"
                        properties={{
                          name: 'subscribableType',
                          label: 'Type',
                          type: 'text',
                          default: elem.type,
                          required: true
                        }}
                      >
                        {Input}
                      </Field>
                    </div>

                    <div className="column small-12">
                      <Field
                        ref={(c) => {
                          if (c) FORM_ELEMENTS.elements.dataQuery = c;
                        }}
                        onChange={dataQuery =>
                          this.onSubscribableChange({ dataQuery, id: elem.id })
                        }
                        validations={['required']}
                        className="-fluid"
                        button={
                          <button
                            type="button"
                            className="c-button -secondary"
                            onClick={() => this.onToggleSubscribableModal(elem.id)}
                          >
                            Try it
                          </button>
                        }
                        properties={{
                          name: 'dataQuery',
                          label: 'Data query',
                          type: 'text',
                          default: elem.dataQuery,
                          required: true
                        }}
                      >
                        {Input}
                      </Field>

                      {this.state.activeSubscriptionModal === elem.id && (
                        <Modal isOpen onRequestClose={() => this.onToggleSubscribableModal(null)}>
                          <TrySubscriptionModal query={elem.dataQuery} />
                        </Modal>
                      )}
                    </div>

                    <div className="column small-12">
                      <Field
                        ref={(c) => {
                          if (c) FORM_ELEMENTS.elements.subscriptionQuery = c;
                        }}
                        onChange={subscriptionQuery =>
                          this.onSubscribableChange({ subscriptionQuery, id: elem.id })
                        }
                        validations={['required']}
                        className="-fluid"
                        button={
                          <button
                            type="button"
                            className="c-button -secondary"
                            onClick={() => this.onToggleSubscribableModal(elem.id)}
                          >
                            Try it
                          </button>
                        }
                        properties={{
                          name: 'subscriptionQuery',
                          label: 'Subscription query',
                          type: 'text',
                          default: elem.subscriptionQuery,
                          required: true
                        }}
                      >
                        {Input}
                      </Field>

                      {this.state.activeSubscriptionModal === elem.id && (
                        <Modal isOpen onRequestClose={() => this.onToggleSubscribableModal(null)}>
                          <TrySubscriptionModal query={elem.subscriptionQuery} />
                        </Modal>
                      )}
                    </div>

                    <div className="column small-12 remove-subscribable-container">
                      <button
                        type="button"
                        className="c-button -secondary"
                        onClick={() => this.handleRemoveSubscription(elem.id)}
                        disabled={this.state.form.subscribable.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="c-field-row">
                <div className="l-row row">
                  <div className="column small-12 add-subscribable-container">
                    <button
                      type="button"
                      className="c-button -secondary -fullwidth"
                      onClick={this.handleAddSubscription}
                    >
                      Add subscription
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*
           *****************************************************
           ****************** DOCUMENT ****************
           *****************************************************
           */}

          {isDocument && user.role === 'ADMIN' && !basic && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.verified = c;
              }}
              onChange={value => this.props.onChange({ verified: value.checked })}
              validations={['required']}
              properties={{
                name: 'verified',
                label: 'Is this dataset verified?',
                value: 'verified',
                title: 'Verified',
                checked: this.props.form.verified
              }}
            >
              {Checkbox}
            </Field>
          )}

          {isDocument && !dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={({ fields, value }) => {
                this.props.onChange({
                  connectorUrl: value,
                  ...(!!fields && { columnFields: fields })
                });
              }}
              validations={['required', 'url']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint / File',
                type: 'text',
                placeholder: 'Paste a URL here or browse file',
                authorization,
                provider: this.state.form.provider,
                default: this.state.form.connectorUrl,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {File}
            </Field>
          )}

          {isDocument && !!dataset && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.connectorUrl = c;
              }}
              onChange={(value) => {
                this.props.onChange({ connectorUrl: value });
              }}
              validations={['required', 'url']}
              className="-fluid"
              properties={{
                name: 'connectorUrl',
                label: 'Url data endpoint / File',
                type: 'text',
                default: this.state.form.connectorUrl,
                disabled: !!this.state.dataset,
                required: true
              }}
            >
              {Input}
            </Field>
          )}

          {(isJson || isXml) && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.dataPath = c;
              }}
              onChange={value => this.props.onChange({ dataPath: value })}
              hint="Name of the element that you want to import"
              validations={isXml ? ['required'] : []}
              className="-fluid"
              properties={{
                name: 'dataPath',
                label: 'Data path',
                type: 'text',
                default: this.state.form.dataPath,
                disabled: !!this.state.dataset,
                required: isXml
              }}
            >
              {Input}
            </Field>
          )}

          {dateColumns.length > 0 && (
            <Field
              ref={(c) => {
                if (c) FORM_ELEMENTS.elements.mainDateField = c;
              }}
              onChange={value => this.props.onChange({ mainDateField: value })}
              options={dateColumns}
              className="-fluid"
              properties={{
                name: 'mainDateField',
                label: 'Main date',
                type: 'text',
                placeholder: 'Select or type',
                optionRenderer: this.renderMainDateOptions,
                default: this.state.form.mainDateField
              }}
            >
              {Select}
            </Field>
          )}

          {isDocument && columnFields && (
            <div className="c-field-row">
              <div className="row l-row">
                <div className="column small-12 medium-6">
                  <Field
                    ref={(c) => {
                      if (c) FORM_ELEMENTS.elements.lat = c;
                    }}
                    onChange={value => this.onLegendChange({ lat: value })}
                    hint="Name of column with latitude value"
                    options={columnFieldsOptions}
                    className="-fluid"
                    properties={{
                      name: 'lat',
                      label: 'Latitude',
                      type: 'text',
                      placeholder: 'Select or type the column...',
                      disabled: !!this.state.dataset,
                      default: this.state.form.legend.lat
                    }}
                  >
                    {Select}
                  </Field>
                </div>

                <div className="column small-12 medium-6">
                  <Field
                    ref={(c) => {
                      if (c) FORM_ELEMENTS.elements.long = c;
                    }}
                    onChange={value => this.onLegendChange({ long: value })}
                    hint="Name of column with longitude value"
                    options={columnFieldsOptions}
                    className="-fluid"
                    properties={{
                      name: 'long',
                      label: 'Longitude',
                      type: 'text',
                      placeholder: 'Select or type the column...',
                      disabled: !!this.state.dataset,
                      default: this.state.form.legend.long
                    }}
                  >
                    {Select}
                  </Field>
                </div>

                <div className="column small-12 medium-6">
                  <Field
                    ref={(c) => {
                      if (c) FORM_ELEMENTS.elements.date = c;
                    }}
                    onChange={value => this.onLegendChange({ date: value })}
                    hint="Name of columns with date value (ISO Format)"
                    options={columnFieldsOptions}
                    className="-fluid"
                    properties={{
                      name: 'date',
                      label: 'Date',
                      type: 'text',
                      disabled: !!this.state.dataset,
                      placeholder: 'Select or type the column..'
                    }}
                  >
                    {Select}
                  </Field>
                </div>

                <div className="column small-12 medium-6">
                  <Field
                    ref={(c) => {
                      if (c) FORM_ELEMENTS.elements.country = c;
                    }}
                    onChange={value => this.onLegendChange({ country: value })}
                    hint="Name of columns with country value (ISO3 code)"
                    options={columnFieldsOptions}
                    className="-fluid"
                    properties={{
                      name: 'country',
                      label: 'Country',
                      type: 'text',
                      disabled: !!this.state.dataset,
                      placeholder: 'Select or type the column...'
                    }}
                  >
                    {Select}
                  </Field>
                </div>
              </div>
            </div>
          )}
        </fieldset>

        {this.state.form.provider && dataset && (
          <fieldset className="c-field-container">
            <Title className="-default -secondary">Relevant Columns</Title>

            {loadingColumns && <Spinner className="-inline" isLoading={loadingColumns} />}

            {!loadingColumns && !columns.length && <p>No columns</p>}

            {!!columns.length && (
              <div className="c-field-row">
                <div className="l-row row">
                  <div className="column small-12 medium-6">
                    <Field
                      options={columns.map(c => ({ label: c.name, value: c.name }))}
                      ref={(c) => {
                        if (c) FORM_ELEMENTS.elements.widgetRelevantProps = c;
                      }}
                      onChange={value => this.props.onChange({ widgetRelevantProps: value })}
                      className="-fluid"
                      properties={{
                        name: 'widgetRelevantProps',
                        label: 'Widget relevant columns',
                        multi: true,
                        instanceId: 'selectWidgetRelevantProps',
                        placeholder: 'Select the dataset columns...',
                        default: this.state.form.widgetRelevantProps.map(column => ({
                          label: column,
                          value: column
                        })),
                        value: this.state.form.widgetRelevantProps.map(column => ({
                          label: column,
                          value: column
                        }))
                      }}
                    >
                      {Select}
                    </Field>
                  </div>

                  <div className="column small-12 medium-6">
                    <Field
                      options={columns.map(c => ({ label: c.name, value: c.name }))}
                      ref={(c) => {
                        if (c) FORM_ELEMENTS.elements.layerRelevantProps = c;
                      }}
                      onChange={value => this.props.onChange({ layerRelevantProps: value })}
                      className="-fluid"
                      properties={{
                        name: 'layerRelevantProps',
                        label: 'Layer relevant columns',
                        multi: true,
                        instanceId: 'selectLayerRelevantProps',
                        placeholder: 'Select the dataset columns...',
                        default: this.state.form.layerRelevantProps.map(column => ({
                          label: column,
                          value: column
                        })),
                        value: this.state.form.layerRelevantProps.map(column => ({
                          label: column,
                          value: column
                        }))
                      }}
                    >
                      {Select}
                    </Field>
                  </div>
                </div>
              </div>
            )}
          </fieldset>
        )}

        {this.state.form.provider && dataset && sortedLayers.length > 0 && (
          <fieldset className="c-field-container">
            <Title className="-default -secondary">Layer Sorting</Title>
            <SortingLayerManager layers={sortedLayers} onChange={this.handleSortLayer} />
          </fieldset>
        )}
      </div>
    );
  }
}

export default Step1;
