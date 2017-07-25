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
import HowToWidgetEditorModal from 'components/modal/HowToWidgetEditorModal';

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
        dataset: this.props.dataset,
        tableName: this.props.tableName
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  @Autobind
  handleUpdateWidget() {
    if (confirm('Are you sure you want to update your widget?')) {
      this.props.onUpdateWidget();
    }
  }

  @Autobind
  handleNeedHelp() {
    const options = {
      children: HowToWidgetEditorModal,
      childrenProps: {}
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  render() {
    const {
      dataset,
      tableName,
      jiminy,
      widgetEditor,
      tableViewMode,
      user,
      mode,
      showSaveButton
     } = this.props;
    const { chartType, fields, category, value } = widgetEditor;

    const showSaveButtonFlag =
      chartType && category && value && user && user.token && showSaveButton;
    const showUpdateButton = showSaveButtonFlag;

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
          <button
            className="c-button -primary"
            onClick={this.handleNeedHelp}
          >
            Need help?
          </button>
          {showSaveButtonFlag && mode === 'save' &&
          <a
            onClick={this.handleSaveWidget}
          >
            Save widget
          </a>
          }
          {mode === 'update' &&
          <a
            onClick={this.handleShareEmbed}
          >
            Sahre/embed
          </a>
          }
          {showUpdateButton && mode === 'update' &&
          <a
            onClick={this.handleUpdateWidget}
          >
            Update widget
          </a>
          }
        </div>
      </div>
    );
  }
}


ChartEditor.propTypes = {
  mode: PropTypes.string.isRequired, // save | update
  tableName: PropTypes.string.isRequired,
  jiminy: PropTypes.object,
  dataset: PropTypes.string.isRequired, // Dataset ID
  tableViewMode: PropTypes.bool.isRequired,
  showSaveButton: PropTypes.bool.isRequired,
  // Store
  widgetEditor: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setChartType: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  // Callback
  onUpdateWidget: PropTypes.func
};

const mapStateToProps = ({ widgetEditor, user }) => ({ widgetEditor, user });
const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  },
  toggleModal: (open) => { dispatch(toggleModal(open)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ChartEditor);
