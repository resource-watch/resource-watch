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

  @Autobind
  handleChartTypeChange(val) {
    this.props.setChartType(val);
  }

  render() {
    const { dataset, tableName, jiminy, fields, widgetEditor } = this.props;
    const { chartType } = widgetEditor;

    return (
      <div className="c-chart-editor">
        <div className="chart-type">
          <h5>Chart type</h5>
          {
              jiminy && jiminy.general &&
              <Select
                properties={{
                  className: 'chart-type-selector',
                  name: 'chart-type',
                  value: chartType
                }}
                options={jiminy.general.map(val => (
                  {
                    label: val,
                    value: val
                  }
                ))}
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
  widgetEditor: PropTypes.object.isRequired,
  setChartType: PropTypes.func.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ChartEditor);
