import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { resetWidgetEditor, setFields } from 'redactions/widgetEditor';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Services
import DatasetService from 'services/DatasetService';

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
import getQueryByFilters from 'utils/getQueryByFilters';
import BarChart from 'utils/widgets/bar';
import LineChart from 'utils/widgets/line';
import PieChart from 'utils/widgets/pie';
import OneDScatterChart from 'utils/widgets/1d_scatter';
import OneDTickChart from 'utils/widgets/1d_tick';
import ScatterChart from 'utils/widgets/scatter';
import ChartTheme from 'utils/widgets/theme';
import LayerManager from 'utils/layers/LayerManager';

const VISUALIZATION_TYPES = [
  { label: 'Chart', value: 'chart' },
  { label: 'Map', value: 'map' },
  { label: 'Table', value: 'table' }
];
const oneDimensionalChartTypes = ['1d_scatter', '1d_tick'];
const CHART_TYPES = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  '1d_scatter': OneDScatterChart,
  '1d_tick': OneDTickChart
};
const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedVisualizationType: 'chart',
      loading: true,
      fieldsLoaded: false,
      jiminyLoaded: false,
      fields: [],
      tableName: null,
      // Whether the chart is loading its data/rendering
      chartLoading: false,
      // Jiminy
      jiminy: {}
    };

    // Each time the editor is opened again, we reset the Redux's state
    // associated with it
    props.resetWidgetEditor();

    // DatasetService
    this.datasetService = new DatasetService(props.dataset, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.datasetService.getFields()
      .then((response) => {
        this.props.setFields(response.fields);
        this.setState({
          loading: !this.state.jiminyLoaded,
          fieldsLoaded: true
        }, () => {
          this.getJiminy();
          this.getTableName();
        });
      })
      .catch((error) => {
        console.log('error', error); // eslint-disable-line no-console
      });
  }

  getJiminy() {
    const fieldsSt = this.props.widgetEditor.fields
      .map(elem => (elem.columnType !== 'geometry') && (elem.columnName !== 'cartodb_id') && elem.columnName)
      .filter(field => !!field);
    const querySt = `SELECT ${fieldsSt} FROM ${this.props.dataset} LIMIT 300`;
    this.datasetService.fetchJiminy(querySt)
      .then((jiminy) => {
        this.setState({
          loading: !this.state.fieldsLoaded,
          jiminyLoaded: true,
          jiminy
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ loading: false });
      });
  }

  getTableName() {
    this.datasetService.fetchData()
      .then(({ attributes }) => {
        this.setState({
          tableName: attributes.tableName
        });
      });
  }

  getDataURL() {
    const { widgetEditor } = this.props;
    const { category, value, color, size, filters, aggregateFunction, orderBy, limit } = widgetEditor;
    const isBidimensional = this.isBidimensionalChart();

    if (!category || (isBidimensional && !value)) return '';

    const columns = [
      { key: 'x', value: category.name, as: true }
    ];

    if (isBidimensional) {
      columns.push({ key: 'y', value: value.name, as: true });

      if (aggregateFunction) {
        // If there's an aggregate function, we group the results
        // with the first column (dimension x)
        columns[0].group = true;

        // We then apply the aggregate function to the current
        // column
        columns[1].aggregateFunction = aggregateFunction;
      }
    }

    if (color) {
      columns.push({ key: 'color', value: color.name, as: true });
    }

    if (size) {
      columns.push({ key: 'size', value: size.name, as: true });
    }

    const tableName = this.state.tableName;
    let orderByColumn = orderBy ? [orderBy] : [];
    if (orderByColumn.length > 0 && value && category && aggregateFunction && orderByColumn[0].name === value.name) {
      orderByColumn = [{ name: 'y' }];
    } else if (orderByColumn.length > 0 && value && category && aggregateFunction && orderByColumn[0].name === category.name) {
      orderByColumn = [{ name: 'x' }];
    }
    const sortOrder = orderBy ? orderBy.orderType : 'asc';
    const query = `${getQueryByFilters(tableName, filters, columns, orderByColumn, sortOrder)} LIMIT ${limit}`;

    // TODO: remove the limit
    return `${process.env.WRI_API_URL}/query/${this.props.dataset}?sql=${query}`;
  }

  getChartTheme() {
    return ChartTheme({
      chart: this.state.selectedChartType
    });
  }

  getChartConfig() {
    const { widgetEditor } = this.props;
    const { category, value, size, color, chartType } = widgetEditor;

    return CHART_TYPES[chartType]({
      // In the future, we could pass the type of the columns so the chart
      // could select the right scale
      columns: {
        x: { present: true, type: category.type },
        y: { present: !!value, type: value.type },
        color: { present: !!color },
        size: { present: !!size }
      },
      data: {
        url: this.getDataURL(),
        property: 'data'
      }
    });
  }

  isBidimensionalChart() {
    return !oneDimensionalChartTypes.includes(this.props.widgetEditor.chartType);
  }

  canRenderChart() {
    const { widgetEditor } = this.props;
    const { category, value, chartType } = widgetEditor;

    return chartType
      && category
      && category.name
      && (
        (this.isBidimensionalChart()
          && value
          && value.name
        )
        || !this.isBidimensionalChart()
      );
  }

  @Autobind
  handleVisualizationTypeChange(val) {
    this.setState({
      selectedVisualizationType: val
    });
  }

  getVisualization() {
    const { tableName, selectedVisualizationType, chartLoading } = this.state;
    const { widgetEditor, dataset } = this.props;
    const { chartType, layer, fields } = widgetEditor;

    let visualization = null;
    switch (selectedVisualizationType) {

      case 'chart':
        if (!tableName) {
          visualization = (
            <div className="visualization -chart">
              <Spinner className="-light" isLoading />
            </div>
          );
        } else if (!this.canRenderChart()) {
          visualization = (
            <div className="visualization -chart">
              Select a type of chart and columns
            </div>
          );
        } else if (!CHART_TYPES[chartType]) {
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
                data={this.getChartConfig()}
                theme={this.getChartTheme()}
                toggleLoading={val => this.setState({ chartLoading: val })}
              />
            </div>
          );
        }
        break;

      case 'map':
        if (layer) {
          visualization = (
            <div className="visualization">
              <Map
                LayerManager={LayerManager}
                mapConfig={mapConfig}
                layersActive={[layer]}
              />
              <Legend
                layersActive={[layer]}
                className={{ color: '-dark' }}
                toggleModal={this.props.toggleModal}
                setModalOptions={this.props.setModalOptions}
              />
            </div>
          );
        }
        break;
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

  render() {
    const {
      loading,
      tableName,
      selectedVisualizationType,
      jiminy
    } = this.state;

    const { dataset, widgetEditor } = this.props;
    const { fields } = widgetEditor;

    const visualization = this.getVisualization();

    // We filter out the visualizations that aren't present in
    // this.props.availableVisualizations
    const visualizationsOptions = VISUALIZATION_TYPES
      .filter(viz => this.props.availableVisualizations.includes(viz.value));

    return (
      <div className="c-widget-editor">
        <div className="l-container">
          <div className="row expanded">
            <div className="customize-visualization">
              { loading && <Spinner className="-light" isLoading={loading} /> }
              <h2
                className="title"
              >
                Customize Visualization
              </h2>
              <div className="visualization-type">
                <h5>Visualization type</h5>
                <Select
                  properties={{
                    className: 'chart-type-selector',
                    name: 'visualization-type',
                    value: selectedVisualizationType
                  }}
                  options={visualizationsOptions}
                  onChange={this.handleVisualizationTypeChange}
                />
              </div>
              {
                selectedVisualizationType !== 'map' && fields && tableName &&
                <ChartEditor
                  dataset={dataset}
                  jiminy={jiminy}
                  tableName={tableName}
                  tableViewMode={selectedVisualizationType === 'table'}
                />
              }
              {
                selectedVisualizationType === 'map' &&
                <MapEditor
                  dataset={dataset}
                  tableName={tableName}
                />
              }
            </div>
            {visualization}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  resetWidgetEditor: () => dispatch(resetWidgetEditor()),
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setFields: (fields) => { dispatch(setFields(fields)); }
});

WidgetEditor.propTypes = {
  dataset: PropTypes.string, // Dataset ID
  availableVisualizations: PropTypes.arrayOf(
    PropTypes.oneOf(VISUALIZATION_TYPES.map(viz => viz.value))
  ),
  // Store
  widgetEditor: PropTypes.object,
  resetWidgetEditor: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired
};

WidgetEditor.defaultProps = {
  availableVisualizations: VISUALIZATION_TYPES.map(viz => viz.value)
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(WidgetEditor);
