import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setChartType } from 'redactions/widgetEditor';

// Components
import ColumnBox from 'components/widgets/ColumnBox';
import FilterContainer from 'components/widgets/FilterContainer';
import ColorContainer from 'components/widgets/ColorContainer';
import SizeContainer from 'components/widgets/SizeContainer';
import CategoryContainer from 'components/widgets/CategoryContainer';
import ValueContainer from 'components/widgets/ValueContainer';
import Select from 'components/form/SelectInput';

// Utils
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
class ChartEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedChartType: null
    };
  }

  getDataURL() {
    const { widgetEditor } = this.props;
    const { category } = widgetEditor;
    const { value } = widgetEditor;
    const { color } = widgetEditor;
    const { size } = widgetEditor;
    const { filters } = widgetEditor;
    const isBidimensional = this.isBidimensionalChart();

    if (!category || (isBidimensional && !value)) return '';

    const columns = [
      { key: 'x', value: category.name, as: true },
      { key: 'y', value: value.name, as: true }
    ];

    // if (isBidimensional) {
    //   columns.push({ key: 'y', value: value.name, as: true });
    // }

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

  getChartConfig() {
    const { widgetEditor } = this.props;
    const { value } = widgetEditor;
    const { color } = widgetEditor;
    const { size } = widgetEditor;

    return CHART_TYPES[this.state.selectedChartType]({
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
    return !oneDimensionalChartTypes.includes(this.state.selectedChartType);
  }

  canRenderChart() {
    const { widgetEditor } = this.props;
    const { category } = widgetEditor;
    const { value } = widgetEditor;

    return this.state.selectedChartType
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
  handleChartTypeChange(val) {
    this.setState({
      selectedChartType: val
    });
    this.props.setChartType(val);
  }

  render() {
    const { dataset, tableName, jiminy, fields } = this.props;

    return (
      <div className="c-chart-editor">
        <div className="chart-type">
          <h5>Chart type</h5>
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
            {/* TODO: should we create a component wrapping the dimensions? */}
            <div className="c-dimensions-container">
              <h5>Dimensions</h5>
              <CategoryContainer />
              <ValueContainer />
              <ColorContainer />
              <SizeContainer />
            </div>
            <FilterContainer />
          </div>
        </div>
      </div>
    );
  }
}


ChartEditor.propTypes = {
  tableName: PropTypes.string.isRequired,
  jiminy: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  dataset: PropTypes.string.isRequired, // Dataset ID
  // Store
  widgetEditor: PropTypes.object,
  setChartType: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(ChartEditor);
