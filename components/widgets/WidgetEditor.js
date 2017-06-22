import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import DatasetService from 'services/DatasetService';
import ColumnBox from 'components/widgets/ColumnBox';
import FilterContainer from 'components/widgets/FilterContainer';
import ColorContainer from 'components/widgets/ColorContainer';
import SizeContainer from 'components/widgets/SizeContainer';
import DimensionXContainer from 'components/widgets/DimensionXContainer';
import DimensionYContainer from 'components/widgets/DimensionYContainer';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import getQueryByFilters from 'utils/getQueryByFilters';
import BarChart from 'utils/widgets/bar';
import LineChart from 'utils/widgets/line';
import PieChart from 'utils/widgets/pie';
import OneDScatterChart from 'utils/widgets/1d_scatter';
import OneDTickChart from 'utils/widgets/1d_tick';
import ScatterChart from 'utils/widgets/scatter';

const oneDimensionalChartTypes = ['pie', '1d_scatter', '1d_tick'];
const CHART_TYPES = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  '1d_scatter': OneDScatterChart,
  '1d_tick': OneDTickChart
};

@DragDropContext(HTML5Backend)
class WidgetEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChartType: null,
      loading: true,
      fieldsLoaded: false,
      jiminyLoaded: false,
      fields: [],
      tableName: null,
      // Jiminy
      jiminy: {}
    };

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
    const fieldsSt = this.state.fields.fields.map(elem => elem.columnType !== 'geometry' && elem.columnName);
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
    const { dimensionX } = widgetEditor;
    const { dimensionY } = widgetEditor;
    const { color } = widgetEditor;
    const { size } = widgetEditor;
    const isBidimensional = this.isBidimensionalChart();

    if (!dimensionX || (isBidimensional && !dimensionY)) return '';

    const columns = [
      { key: 'x', value: dimensionX.name, as: true }
    ];

    if (isBidimensional) {
      columns.push({ key: 'y', value: dimensionY.name, as: true });
    }

    if (color) {
      columns.push({ key: 'color', value: color.name, as: true });
    }

    if (size) {
      columns.push({ key: 'size', value: size.name, as: true });
    }

    const tableName = this.state.tableName;
    const query = getQueryByFilters(tableName, [], columns);

    // TODO: remove the limit
    return `${process.env.WRI_API_URL}/query/${this.props.dataset}?sql=${query} LIMIT 200`;
  }

  getChartConfig() {
    const { widgetEditor } = this.props;
    const { dimensionY } = widgetEditor;
    const { color } = widgetEditor;
    const { size } = widgetEditor;

    return CHART_TYPES[this.state.selectedChartType]({
      // In the future, we could pass the type of the columns so the chart
      // could select the right scale
      columns: {
        x: { present: true },
        y: { present: !!dimensionY },
        color: { present: !!color },
        size: { present: !!size }
      },
      data: {
        url: this.getDataURL(),
        property: 'data'
      }
    });
    // return Object.assign({}, CHART_TYPES[this.state.selectedChartType], {
    //   data: [
    //     {
    //       url: this.getDataURL(),
    //       name: 'table',
    //       format: {
    //         type: 'json',
    //         property: 'data'
    //       }
    //     }
    //   ]
    // });
  }

  isBidimensionalChart() {
    return !oneDimensionalChartTypes.includes(this.state.selectedChartType);
  }

  canRenderChart() {
    const { widgetEditor } = this.props;
    const { dimensionX } = widgetEditor;
    const { dimensionY } = widgetEditor;

    return this.state.selectedChartType
      && dimensionX
      && dimensionX.name
      && (
        (this.isBidimensionalChart()
          && dimensionY
          && dimensionY.name
        )
        || !this.isBidimensionalChart()
      );
  }

  @Autobind
  handleChartTypeChange(val) {
    this.setState({
      selectedChartType: val
    });
  }

  render() {
    const { fields, jiminy, loading, tableName, selectedChartType } = this.state;
    const { dataset } = this.props;

    let visualization = null;
    if (!tableName) {
      visualization = 'Loading...';
    } else if (!this.canRenderChart()) {
      visualization = 'Select a type of chart and columns';
    } else if (!CHART_TYPES[selectedChartType]) {
      visualization = `This chart can't be previewed`; // eslint-disable-line quotes
    } else {
      visualization = <VegaChart data={this.getChartConfig()} />;
    }

    return (
      <div className="c-widget-editor">
        { loading && <Spinner className="-light" isLoading={loading} /> }
        <div className="customize-visualization">
          <h2
            className="title"
          >
            Customize Visualization
          </h2>
          <div className="chart-type">
            <h5>Visualization type</h5>
            {
              jiminy && jiminy.general &&
              <Select
                properties={{
                  className: 'chart-type-selector'
                }}
                options={jiminy.general.map(val => (
                  {
                    label: val,
                    value: val
                  }
                ))}
                name="chart-type"
                onChange={this.handleChartTypeChange}

              />
          }
          </div>
          <div className="actions-div">
            <div className="fields">
              <h5>Columns</h5>
              {tableName && fields && fields.fields && fields.fields.map(val =>
                val.columnType !== 'geometry' && (
                  <ColumnBox
                    key={val.columnName}
                    name={val.columnName}
                    type={val.columnType}
                    datasetID={dataset}
                    tableName={tableName}
                  />
                )
              )}
            </div>
            <div className="customization-container">
              <h5>Dimensions</h5>
              <DimensionXContainer />
              { this.isBidimensionalChart() && <DimensionYContainer /> }
              <ColorContainer />
              <SizeContainer />
              <FilterContainer />
            </div>
          </div>
        </div>
        <div className="visualization">
          {visualization}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = () => ({});

WidgetEditor.propTypes = {
  dataset: PropTypes.string, // Dataset ID
  widgetEditor: PropTypes.object
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(WidgetEditor);
