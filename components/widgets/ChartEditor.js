import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { setChartType } from 'redactions/widgetEditor';

// Components
import FilterContainer from 'components/widgets/FilterContainer';
import DimensionsContainer from 'components/widgets/DimensionsContainer';
import FieldsContainer from 'components/widgets/FieldsContainer';
import SortContainer from 'components/widgets/SortContainer';
import LimitContainer from 'components/widgets/LimitContainer';
import Select from 'components/form/SelectInput';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';

@DragDropContext(HTML5Backend)
class ChartEditor extends React.Component {

  @Autobind
  handleChartTypeChange(val) {
    this.props.setChartType(val);
  }

  @Autobind
  handleSaveWidget() {
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset: this.props.dataset
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const { dataset, tableName, jiminy, widgetEditor, tableViewMode } = this.props;
    const { chartType, fields } = widgetEditor;

    const chartOptions = (
        jiminy
        && jiminy.general
        && jiminy.general.map(val => ({ label: val, value: val }))
      ) || [];

    return (
      <div className="c-chart-editor">
        {!tableViewMode &&
          <div className="chart-type">
            <h5>Chart type</h5>
            <Select
              properties={{
                className: 'chart-type-selector',
                name: 'chart-type',
                value: chartType,
                default: chartType
              }}
              options={chartOptions}
              onChange={this.handleChartTypeChange}
            />
          </div>
        }
        <div className="actions-div">
          {fields &&
            <FieldsContainer
              dataset={dataset}
              tableName={tableName}
              fields={fields}
            />
          }
          <div className="customization-container">
            <DimensionsContainer />
            <FilterContainer />
            <SortContainer />
            <LimitContainer />
          </div>
        </div>
        <div className="save-widget-container">
          <a
            onClick={this.handleSaveWidget}
          >
            Save widget
          </a>
        </div>
      </div>
    );
  }
}


ChartEditor.propTypes = {
  tableName: PropTypes.string.isRequired,
  jiminy: PropTypes.object,
  dataset: PropTypes.string.isRequired, // Dataset ID
  tableViewMode: PropTypes.bool.isRequired,
  // Store
  widgetEditor: PropTypes.object.isRequired,
  setChartType: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapStateToProps = ({ widgetEditor }) => ({ widgetEditor });
const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ChartEditor);
