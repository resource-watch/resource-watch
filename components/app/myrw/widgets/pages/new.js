import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { setTitle } from 'components/widgets/editor/redux/widgetEditor';

// Services
import WidgetService from 'services/WidgetService';
import DatasetsService from 'services/DatasetsService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetEditor from 'components/widgets/editor/WidgetEditor';
import Button from 'components/ui/Button';
import Input from 'components/form/Input';
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// Utils
import { getChartConfig, canRenderChart, getChartInfo } from 'utils/widgets/WidgetHelper';
import { logEvent } from 'utils/analytics';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

class WidgetsNew extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      loadingPublishedDatasets: true,
      loadingUserDatasets: true,
      submitting: false,
      datasets: [],
      selectedDataset: props.dataset,
      widget: {}
    };

    // Services
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
    this.datasetsService = new DatasetsService({
      language: props.locale
    });

    // ------------------- Bindings -----------------------
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDatasetSelected = this.handleDatasetSelected.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadDatasets();
  }

  async onSubmit(event) {
    if (event) event.preventDefault();

    const { widget, selectedDataset, datasets } = this.state;
    const { widgetEditor, user } = this.props;
    const {
      visualizationType,
      band,
      limit,
      value,
      category,
      color,
      size,
      orderBy,
      aggregateFunction,
      chartType,
      filters,
      areaIntersection,
      layer,
      title,
      zoom,
      latLng
    } = widgetEditor;

    const dataset = datasets.find(elem => elem.value === selectedDataset);
    const { type, provider, tableName } = dataset;

    if (!canRenderChart(widgetEditor, provider)) {
      toastr.error('Error', 'Please create a widget in order to save it');
      return;
    }

    logEvent('My RW', 'User creates new widget', this.state.datasets.find(d => d.id === this.state.selectedDataset).label);

    this.setState({ loading: true });

    let chartConfig;

    // If the visualization if a map, we don't have any chartConfig
    if (visualizationType !== 'map') {
      const chartInfo = getChartInfo(dataset.id, type, provider, widgetEditor);

      try {
        chartConfig = await getChartConfig(
          dataset.id,
          type,
          tableName,
          band,
          provider,
          chartInfo
        );
      } catch (err) {
        this.setState({
          saved: false,
          loading: false
        });
        toastr.error('Error', 'Unable to generate the configuration of the chart');

        return;
      }
    }

    const widgetConfig = {
      widgetConfig: Object.assign(
        {},
        // If the widget is a map, we want to add some extra info
        // in widgetConfig so the widget is compatible with other
        // apps that use the same API
        // The type and layer_id are not necessary for the editor
        // because it is already saved in widgetConfig.paramsConfig
        (
          visualizationType === 'map'
            ? { type: 'map', layer_id: layer && layer.id, zoom, ...latLng }
            : {}
        ),
        {
          paramsConfig: {
            visualizationType,
            band: band && { name: band.name },
            limit,
            value,
            category,
            color,
            size,
            orderBy,
            aggregateFunction,
            chartType,
            filters,
            areaIntersection,
            layer: layer && layer.id
          }
        },
        chartConfig
      )
    };

    const widgetObj = Object.assign(
      {},
      {
        name: title,
        description: widget.description,
        authors: widget.authors,
        source: widget.source,
        sourceUrl: widget.sourceUrl
      },
      widgetConfig
    );

    this.widgetService.saveUserWidget(widgetObj, selectedDataset, user.token)
      .then((response) => {
        if (response.errors) {
          const errorMessage = response.errors[0].detail;
          this.setState({
            saved: false,
            loading: false
          });

          toastr.error('Error', errorMessage);
        } else {
          Router.pushRoute('myrw', { tab: 'widgets', subtab: 'my_widgets' });
          toastr.success('Success', 'Widget created successfully!');
        }
      }).catch((err) => {
        this.setState({
          saved: false,
          loading: false
        });
        toastr.err('Error', err);
      });
  }


  loadDatasets() {
    this.datasetsService.fetchAllData({ filters: { published: true }, includes: 'metadata' }).then((response) => {
      this.setState({
        datasets: [...this.state.datasets, ...response.map((dataset) => {
          const metadata = dataset.metadata[0];
          return ({
            id: dataset.id,
            type: dataset.type,
            provider: dataset.provider,
            tableName: dataset.tableName,
            label: metadata && metadata.attributes.info
              ? metadata.attributes.info.name
              : dataset.name,
            value: dataset.id
          });
        })],
        loadingPublishedDatasets: false
      });
    });

    this.datasetsService.fetchAllData(
      { filters: { userId: this.props.user.id }, includes: 'metadata' }).then((response) => {
      this.setState({
        datasets: [...this.state.datasets, ...response.map((dataset) => {
          const metadata = dataset.metadata[0];
          return ({
            id: dataset.id,
            type: dataset.type,
            provider: dataset.provider,
            tableName: dataset.tableName,
            label: metadata && metadata.attributes.info
              ? metadata.attributes.info.name
              : dataset.name,
            value: dataset.id
          });
        })],
        loadingUserDatasets: false
      });
    });
  }

  handleChange(value) {
    const newWidgetObj = Object.assign({}, this.state.widget, value);
    this.setState({ widget: newWidgetObj });

    if (Object.keys(value).indexOf('name') !== -1) {
      this.props.setTitle(value.name);
    }
  }

  handleDatasetSelected(value) {
    this.setState({
      selectedDataset: value
    });
  }

  render() {
    const {
      loading,
      widget,
      submitting,
      datasets,
      selectedDataset,
      loadingUserDatasets,
      loadingPublishedDatasets
    } = this.state;
    const { widgetEditor } = this.props;

    return (
      <div className="c-myrw-widgets-new">
        <Spinner
          className="-light"
          isLoading={loading || loadingPublishedDatasets || loadingUserDatasets}
        />
        {datasets &&
          <div className="dataset-selector">
            <Field
              onChange={this.handleDatasetSelected}
              className="-fluid"
              options={datasets}
              properties={{
                name: 'dataset',
                label: 'Dataset',
                value: selectedDataset,
                default: selectedDataset,
                required: true,
                instanceId: 'selectDataset'
              }}
            >
              {Select}
            </Field>
          </div>
        }
        {selectedDataset &&
        <div>
          <WidgetEditor
            widget={widget}
            dataset={selectedDataset}
            mode="widget"
            onUpdateWidget={this.onSubmit}
            showSaveButton
          />
          <div className="form-container">
            <form className="form-container" onSubmit={this.onSubmit}>
              <fieldset className="c-field-container">
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.title = c; }}
                  onChange={value => this.handleChange({ name: value })}
                  validations={['required']}
                  properties={{
                    title: 'title',
                    label: 'Title',
                    type: 'text',
                    required: true,
                    default: widgetEditor.title || '',
                    value: widgetEditor.title || '',
                    placeholder: 'Widget title'
                  }}
                >
                  {Input}
                </Field>
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.description = c; }}
                  onChange={value => this.handleChange({ description: value })}
                  properties={{
                    title: 'description',
                    label: 'Description',
                    type: 'text',
                    placeholder: 'Widget description'
                  }}
                >
                  {Input}
                </Field>
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.authors = c; }}
                  onChange={value => this.handleChange({ authors: value })}
                  properties={{
                    title: 'authors',
                    label: 'Authors',
                    type: 'text',
                    placeholder: 'Author name'
                  }}
                >
                  {Input}
                </Field>
                <div className="source-container">
                  <Field
                    ref={(c) => { if (c) FORM_ELEMENTS.elements.source = c; }}
                    onChange={value => this.handleChange({ source: value })}
                    properties={{
                      title: 'source',
                      label: 'Source name',
                      type: 'text',
                      placeholder: 'Source name'
                    }}
                  >
                    {Input}
                  </Field>
                  <Field
                    ref={(c) => { if (c) FORM_ELEMENTS.elements.sourceUrl = c; }}
                    onChange={value => this.handleChange({ sourceUrl: value })}
                    properties={{
                      title: 'sourceUrl',
                      label: 'Source URL',
                      type: 'text',
                      placeholder: 'Paste a URL here'
                    }}
                  >
                    {Input}
                  </Field>
                </div>
              </fieldset>
              <div className="buttons-container">
                <Button
                  properties={{
                    type: 'submit',
                    disabled: submitting,
                    className: '-a'
                  }}
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    );
  }
}

WidgetsNew.propTypes = {
  dataset: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  setTitle: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  widgetEditor: state.widgetEditor,
  locale: state.common.locale
});

const mapDispatchToProps = dispatch => ({
  setTitle: title => dispatch(setTitle(title))
});

export default connect(mapStateToProps, mapDispatchToProps)(WidgetsNew);
