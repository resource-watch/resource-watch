import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';
import isEqual from 'lodash/isEqual';

// Redux
import { connect } from 'react-redux';

import { resetWidgetEditor, setFields } from 'redactions/widgetEditor';

// Services
import DatasetService from 'services/DatasetService';
import WidgetService from 'services/WidgetService';

// Components
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import ChartEditor from 'components/widgets/ChartEditor';
import MapEditor from 'components/widgets/MapEditor';
import Map from 'components/vis/Map';
import Legend from 'components/ui/Legend';
import TableView from 'components/widgets/TableView';

// Utils
import { getChartConfig, canRenderChart, getChartType, isFieldAllowed } from 'utils/widgets/WidgetHelper';
import ChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

const VISUALIZATION_TYPES = [
  { label: 'Chart', value: 'chart', available: true },
  { label: 'Map', value: 'map', available: true },
  { label: 'Table', value: 'table', available: true }
];

const ALL_CHART_TYPES = {
  general: [
    '1d_scatter',
    '1d_tick',
    'bar',
    'line',
    'pie',
    'scatter'
  ]
};

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

const DEFAULT_STATE = {
  selectedVisualizationType: 'chart',
  // FIELDS
  fieldsLoaded: false,
  fieldsError: false,

  tableName: null, // Name of the table
  chartLoading: false, // Whether the chart is loading its data/rendering

  // CHART CONFIG
  chartConfig: null, // Vega chart configuration
  chartConfigError: null, // Error message when fetching the chart configuration
  chartConfigLoading: false, // Whether we're loading the config

  // Jiminy
  jiminy: {},
  jiminyLoaded: false,
  jiminyError: false,
  // Layers
  layers: [],
  layersLoaded: false,
  layersError: false
};

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...DEFAULT_STATE,
      layerGroups: props.widgetEditor.layer
        ? [{
          dataset: props.widgetEditor.layer.dataset,
          visible: true,
          layers: [{
            id: props.widgetEditor.layer.id,
            active: true,
            ...props.widgetEditor.layer
          }]
        }]
        : []
    };

    // Each time the editor is opened again, we reset the Redux's state
    // associated with it
    props.resetWidgetEditor();

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });

    // WidgetService
    this.widgetService = new WidgetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.getFields()
      .then(() => {
        this.getJiminy();
        this.getDatasetInfo();
      })
      .catch(() => {
        // If the fields don't load it's not a real issue
        // because we can still display a map
        if (this.props.onError) this.props.onError();
      });

    if (this.props.mode === 'dataset') {
      this.getLayers();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataset !== this.props.dataset) {
      this.setState({
        ...DEFAULT_STATE,
        layerGroups: nextProps.widgetEditor.layer
          ? [{
            dataset: nextProps.widgetEditor.layer.dataset,
            visible: true,
            layers: [{
              id: nextProps.widgetEditor.layer.id,
              active: true,
              ...nextProps.widgetEditor.layer
            }]
          }]
          : []
      }, () => {
        // DatasetService
        this.datasetService = new DatasetService(nextProps.dataset, {
          apiURL: process.env.WRI_API_URL
        });

        // WidgetService
        this.widgetService = new WidgetService(nextProps.dataset, {
          apiURL: process.env.WRI_API_URL
        });

        this.getFields()
          .then(() => {
            this.getJiminy();
            this.getDatasetInfo();
          })
          .catch(() => {
            console.error('Unable to retrieve the fields');
            if (this.props.onError) this.props.onError();
          });

        if (this.props.mode === 'dataset') {
          this.getLayers();
        }
      });
    } else if (!isEqual(this.props.widgetEditor.layer, nextProps.widgetEditor.layer)) {
      // We update the layerGroups each time the layer changes
      this.setState({
        layerGroups: nextProps.widgetEditor.layer
          ? [{
            dataset: nextProps.widgetEditor.layer.dataset,
            visible: true,
            layers: [{
              id: nextProps.widgetEditor.layer.id,
              active: true,
              ...nextProps.widgetEditor.layer
            }]
          }]
          : []
      });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    // If the configuration of the chart is updated, then we
    // fetch the Vega chart config again
    // NOTE: this can't be moved to componentWillUpdate because
    // this.fetchChartConfig uses the store
    if (canRenderChart(this.props.widgetEditor)
      && (!isEqual(previousProps.widgetEditor, this.props.widgetEditor)
      || previousState.tableName !== this.state.tableName)) {
      this.fetchChartConfig();
    }
  }

  /**
   * Event handler executed when the user toggles the
   * visibility of a layer group
   * @param {LayerGroup} layerGroup - Layer group to toggle
   */
  onToggleLayerGroupVisibility(layerGroup) {
    const layerGroups = this.state.layerGroups.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    this.setState({ layerGroups: [...layerGroups] });
  }

  /**
   * Fetch the fields and save them in the state
   * @returns {Promise<void>}
   */
  getFields() {
    // Functions to resolve and reject the promise
    let resolve;
    let reject;

    // Actual promise
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    this.datasetService.getFields()
      .then((response) => {
        const fields = response.fields.filter(field => !!isFieldAllowed(field));
        const fieldsError = !response.fields || !response.fields.length || fields.length === 0;

        this.setState({
          // We still need to fetch the aliases in getDatasetInfo
          // so we let the loader spinning
          // FIXME: once the fields enpoint is updated, the aliases
          // should come with this query
          fieldsLoaded: false,
          fieldsError
        }, () => {
          // We wait for the state to be updated before doing anything
          // else
          // If there's an error, we throw to enter the catch block
          if (fieldsError) throw new Error('The dataset doesn\'t have fields');

          this.props.setFields(fields);
          resolve();
        });
      })
      // TODO: handle the error case in the UI
      .catch(() => this.setState({ fieldsError: true, fieldsLoaded: true }))
      // If we reach this point, either we have already resolved the promise
      // and so rejecting it has no effect, or we haven't and so we reject it
      .then(reject);

    return promise;
  }

  /**
   * Fetch the information about the layers and save it in the state
   */
  getLayers() {
    this.datasetService.getLayers()
      .then((response) => {
        this.setState({
          layers: response.map(val => ({
            id: val.id,
            name: val.attributes.name,
            subtitle: val.attributes.subtitle,
            ...val.attributes,
            order: 1,
            hidden: false
          })),
          layersLoaded: true
        });
      })
      // TODO: properly handle this in the UI
      .catch(() => {
        this.setState({
          layersLoaded: true,
          layersError: true
        });
        console.error('Unable to fetch the layers');
      });
  }

  /**
   * Fetch the recommendations from Jiminy and save them in the
   * state
   */
  getJiminy() {
    // We get the name of the columns that we can use to build the
    // charts
    const fieldsSt = this.props.widgetEditor.fields
      .map(elem => elem.columnName);

    const querySt = `SELECT ${fieldsSt} FROM ${this.props.dataset} LIMIT 300`;

    this.datasetService.fetchJiminy(querySt)
      .then(jiminy => this.setState({ jiminy, jiminyError: typeof jiminy === 'undefined' }))
      .catch(() => this.setState({ jiminyError: true }))
      .then(() => this.setState({ jiminyLoaded: true }));
  }

  /**
   * Fetch the name of the table and the aliases and descriptions
   * of the columns and save all of that in the store
   */
  getDatasetInfo() {
    this.datasetService.fetchData('metadata')
      .then(({ attributes }) => {
        const metadata = attributes.metadata.length
          && attributes.metadata[0]
          && attributes.metadata[0].attributes.columns;

        // Return the metadata's field for the specified column
        const getMetadata = (column, field) => (metadata
          && metadata[column]
          && metadata[column][field]
        );

        // We add the aliases and descriptions to the fields
        const fields = this.props.widgetEditor.fields.map(field => Object.assign({}, field, {
          alias: getMetadata(field.columnName, 'alias'),
          description: getMetadata(field.columnName, 'description')
        }));

        this.setState({ tableName: attributes.tableName });
        this.props.setFields(fields);
      })
      // TODO: handle the error case in the UI
      .catch(() => console.error('Unable to load the information about the dataset'))
      // FIXME: should be removed once the getFields method can fetch the aliases
      // and description
      .then(() => this.setState({ fieldsLoaded: true }));
  }

  /**
   * Return the visualization itself
   * @returns {HTMLElement}
   */
  getVisualization() {
    const {
      tableName,
      selectedVisualizationType,
      chartLoading,
      layersLoaded,
      fieldsError,
      jiminyLoaded
    } = this.state;

    const { widgetEditor, dataset, mode } = this.props;
    const { chartType, layer } = widgetEditor;

    // Whether we are still waiting for some info
    const loading = (mode === 'dataset' && !layersLoaded) ||
      (!fieldsError && !jiminyLoaded);

    let visualization = null;
    switch (selectedVisualizationType) {
      // Vega chart
      case 'chart':
        if (!tableName) {
          visualization = (
            <div className="visualization -chart">
              <Spinner className="-light" isLoading={loading} />
            </div>
          );
        } else if (this.state.chartConfigLoading) {
          visualization = (
            <div className="visualization -chart">
              <Spinner className="-light" isLoading />
            </div>
          );
        } else if (this.state.chartConfigError) {
          visualization = (
            <div className="visualization -error">
              <div>
                {'Unfortunately, the chart couldn\'t be rendered'}
                <span>{this.state.chartConfigError}</span>
              </div>
            </div>
          );
        } else if (!canRenderChart(widgetEditor) || !this.state.chartConfig) {
          visualization = (
            <div className="visualization -chart">
              Select a type of chart and columns
            </div>
          );
        } else if (!getChartType(chartType)) {
          visualization = (
            <div className="visualization -chart">
              {'This chart can\'t be previewed'}
            </div>
          );
        } else {
          visualization = (
            <div className="visualization -chart">
              <Spinner className="-light" isLoading={chartLoading} />
              <VegaChart
                reloadOnResize
                data={this.state.chartConfig}
                theme={ChartTheme()}
                toggleLoading={val => this.setState({ chartLoading: val })}
              />
            </div>
          );
        }
        break;

      // Leaflet map
      case 'map':
        if (layer) {
          visualization = (
            <div className="visualization">
              <Map
                LayerManager={LayerManager}
                mapConfig={mapConfig}
                layerGroups={this.state.layerGroups}
              />
              <Legend
                layerGroups={this.state.layerGroups}
                className={{ color: '-dark' }}
                toggleLayerGroupVisibility={
                  layerGroup => this.onToggleLayerGroupVisibility(layerGroup)
                }
                setLayerGroupsOrder={() => {}}
                setLayerGroupActiveLayer={() => {}}
                readonly
                expanded={false}
              />
            </div>
          );
        }
        break;

      // HTML table
      case 'table':
        visualization = (
          <div className="visualization">
            <TableView
              dataset={dataset}
              tableName={tableName}
            />
          </div>
        );
        break;

      default:
    }

    return visualization;
  }

  /**
   * Fetch the Vega chart configuration and store it in
   * the state
   * NOTE: the vega chart *will* contain the whole dataset
   * inside and not the URL of the data
   */
  fetchChartConfig() {
    const { widgetEditor, dataset } = this.props;
    const { tableName } = this.state;

    this.setState({ chartConfigLoading: true });

    getChartConfig(widgetEditor, tableName, dataset, true)
      .then((chartConfig) => {
        this.setState({ chartConfig, chartConfigError: null });
        if (this.props.onChange) this.props.onChange(chartConfig);
      })
      .catch(({ message }) => {
        this.setState({ chartConfig: null, chartConfigError: message });
        if (this.props.onChange) this.props.onChange(null);
      })
      .then(() => this.setState({ chartConfigLoading: false }));
  }

  /**
   * Update the user's widget
   */
  @Autobind
  handleUpdateWidget() {
    this.props.onUpdateWidget();
  }

  /**
   * Change the selected visualization in the state
   * @param {string} selectedVisualizationType Visualization type
   */
  @Autobind
  handleVisualizationTypeChange(selectedVisualizationType) {
    this.setState({ selectedVisualizationType });
  }

  render() {
    const {
      tableName,
      selectedVisualizationType,
      jiminyError,
      jiminyLoaded,
      fieldsError,
      fieldsLoaded,
      layersError,
      layersLoaded,
      layers
    } = this.state;
    let { jiminy } = this.state;
    const { dataset, mode, showSaveButton, showShareEmbedButton } = this.props;

    // Whether we're still waiting for some data
    const loading = (mode === 'dataset' && !layersLoaded)
      || !fieldsLoaded
      || !jiminyLoaded;

    const chartEditorMode = (mode === 'dataset') ? 'save' : 'update';

    const visualization = this.getVisualization();

    // TODO: instead of hiding the whole UI, let's show an error message or
    // some kind of feedback for the user
    const componentShouldNotShow = fieldsError && (layersError || (layers && layers.length === 0));

    // We filter out the visualizations that aren't present in
    // this.props.availableVisualizations
    // We don't use this.props.availableVisualizations directly
    // because we want access to the whole object
    let visualizationsOptions = VISUALIZATION_TYPES
      .filter(viz => this.props.availableVisualizations.includes(viz.value));

    // If there was an error retrieving the fields we remove chart and table
    // as visualization options
    if (fieldsError) {
      visualizationsOptions = visualizationsOptions.filter(val => val.value === 'map');
    }

    // If there are no layers created for this dataset we remove the map optiion
    // from the options
    if (layersLoaded && (!layers || (layers && layers.length === 0))) {
      visualizationsOptions = visualizationsOptions.filter(val => val.value !== 'map');
    }

    // In case Jiminy failed to give back a result, we let the user the possibility
    // to render any chart
    if (jiminyError) {
      jiminy = ALL_CHART_TYPES;
    }

    return (
      <div className="c-widget-editor">
        {!componentShouldNotShow &&
          <div className="l-container -expanded">
            <div className="row expanded">
              <div className="customize-visualization">
                { loading && <Spinner className="-light" isLoading={loading} /> }
                <h2
                  className="title"
                >
                  Customize Visualization
                </h2>
                <div className="visualization-type">
                  <div className="c-field">
                    <label>Visualization type</label>
                    <Select
                      properties={{
                        className: 'visualization-type-selector',
                        name: 'visualization-type',
                        value: selectedVisualizationType
                      }}
                      options={visualizationsOptions}
                      onChange={this.handleVisualizationTypeChange}
                    />
                  </div>
                </div>
                {
                  selectedVisualizationType !== 'map' && !fieldsError && tableName &&
                  <ChartEditor
                    dataset={dataset}
                    jiminy={jiminy}
                    tableName={tableName}
                    tableViewMode={selectedVisualizationType === 'table'}
                    mode={chartEditorMode}
                    onUpdateWidget={this.handleUpdateWidget}
                    showSaveButton={showSaveButton}
                    showShareEmbedButton={showShareEmbedButton}
                  />
                }
                {
                  selectedVisualizationType === 'map' && layers && layers.length > 0 &&
                  <MapEditor
                    layerGroups={this.state.layerGroups}
                    layers={layers}
                    tableName={tableName}
                  />
                }
              </div>
              {visualization}
            </div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ widgetEditor, user }) => ({ widgetEditor, user });
const mapDispatchToProps = dispatch => ({
  resetWidgetEditor: () => dispatch(resetWidgetEditor()),
  setFields: (fields) => { dispatch(setFields(fields)); }
});

WidgetEditor.defaultProps = {
  showShareEmbedButton: false
};

WidgetEditor.propTypes = {
  mode: PropTypes.oneOf(['dataset', 'widget']),
  showSaveButton: PropTypes.bool.isRequired, // Show save button in chart editor or not
  showShareEmbedButton: PropTypes.bool.isRequired, // Show share/embed button in chart editor or not
  dataset: PropTypes.string, // Dataset ID
  widget: PropTypes.object, // Widget object
  availableVisualizations: PropTypes.arrayOf(
    PropTypes.oneOf(VISUALIZATION_TYPES.map(viz => viz.value))
  ),
  // Callbacks
  onUpdateWidget: PropTypes.func,
  onChange: PropTypes.func,
  onError: PropTypes.func,
  // Store
  user: PropTypes.object.isRequired,
  widgetEditor: PropTypes.object.isRequired,
  resetWidgetEditor: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired
};

WidgetEditor.defaultProps = {
  availableVisualizations: VISUALIZATION_TYPES.map(viz => viz.value)
};

export default connect(mapStateToProps, mapDispatchToProps)(WidgetEditor);
