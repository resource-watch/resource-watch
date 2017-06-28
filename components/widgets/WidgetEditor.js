import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { resetWidgetEditor } from 'redactions/widgetEditor';

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
  { label: 'Map', value: 'map' }
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
        this.setState({
          loading: !this.state.jiminyLoaded,
          fieldsLoaded: true,
          fields: response
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
    const fieldsSt = this.state.fields.fields
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
    const { category, value, color, size, filters, aggregateFunction } = widgetEditor;
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
    const query = getQueryByFilters(tableName, filters, columns);

    // TODO: remove the limit
    return `${process.env.WRI_API_URL}/query/${this.props.dataset}?sql=${query} LIMIT 1000`;
  }

  getChartTheme() {
    return ChartTheme({
      chart: this.state.selectedChartType
    });
  }

  getChartConfig() {
    const { widgetEditor } = this.props;
    const { value, size, color, chartType } = widgetEditor;

    return CHART_TYPES[chartType]({
      // In the future, we could pass the type of the columns so the chart
      // could select the right scale
      columns: {
        x: { present: true },
        y: { present: !!value },
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

  render() {
    const {
      loading,
      tableName,
      selectedVisualizationType,
      jiminy,
      fields,
      chartLoading
    } = this.state;
    const { dataset, widgetEditor } = this.props;
    const { chartType, layer } = widgetEditor;

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
            {/*<Legend
                layersActive={[layer]}
                className={{ color: '-dark' }}
              />*/}
            </div>
          );
        }
        break;
      default:

    }


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
                  options={VISUALIZATION_TYPES}
                  onChange={this.handleVisualizationTypeChange}
                />
              </div>
              {
                selectedVisualizationType === 'chart' && fields && tableName &&
                <ChartEditor
                  dataset={dataset}
                  jiminy={jiminy}
                  fields={fields}
                  tableName={tableName}
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
  resetWidgetEditor: () => dispatch(resetWidgetEditor())
});

WidgetEditor.propTypes = {
  dataset: PropTypes.string, // Dataset ID
  // Store
  widgetEditor: PropTypes.object,
  resetWidgetEditor: PropTypes.func.isRequired
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(WidgetEditor);
