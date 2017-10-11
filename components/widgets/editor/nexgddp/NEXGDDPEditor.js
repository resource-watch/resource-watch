import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import { connect } from 'react-redux';

import { toggleModal, setModalOptions } from 'redactions/modal';
import { setChartType } from 'components/widgets/editor/redux/widgetEditor';

// Components
import FilterContainer from 'components/widgets/editor/ui/FilterContainer';
import DimensionsContainer from 'components/widgets/editor/ui/DimensionsContainer';
import FieldsContainer from 'components/widgets/editor/ui/FieldsContainer';
import SortContainer from 'components/widgets/editor/ui/SortContainer';
import LimitContainer from 'components/widgets/editor/ui/LimitContainer';
import Select from 'components/widgets/editor/form/SelectInput';
import SaveWidgetModal from 'components/widgets/editor/modal/SaveWidgetModal';
import HowToWidgetEditorModal from 'components/widgets/editor/modal/HowToWidgetEditorModal';
import AreaIntersectionFilter from 'components/widgets/editor/ui/AreaIntersectionFilter';

// NOTE: if you change this array, also update
// the condition of the variable showRequiredTooltip
const CHARTS = ['line', 'bar'];

@DragDropContext(HTML5Backend)
class NEXGDDPEditor extends React.Component {
  @Autobind
  handleChartTypeChange(val) {
    this.props.setChartType(val);
  }

  @Autobind
  handleSaveWidget() {
    const { dataset, datasetType, datasetProvider, tableName } = this.props;
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset,
        datasetType,
        datasetProvider,
        tableName
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  @Autobind
  handleUpdateWidget() {
    this.props.onUpdateWidget();
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

  @Autobind
  handleEmbedTable() {
    this.props.onEmbedTable();
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
      showSaveButton,
      hasGeoInfo,
      showEmbedTable,
      showLimitContainer,
      showOrderByContainer,
      showNotLoggedInText
    } = this.props;
    const {
      chartType,
      fields,
      category,
      value,
      areaIntersection
    } = widgetEditor;
    const showSaveButtonFlag =
      chartType && category && value && user && user.token && showSaveButton;
    const showUpdateButton = showSaveButtonFlag;

    // TODO: Should we do this here?????
    // or should we define it as a prop...
    const chartOptions = (
      jiminy
      && jiminy.general
      && jiminy.general.map(val => ({ label: val, value: val }))
        .filter(c => CHARTS.includes(c.value))
    ) || [];

    return (
      <div className="c-chart-editor">
        <div className="selectors-container">
          {!tableViewMode &&
            <div className="chart-type">
              <div className="c-field">
                <label htmlFor="chart-style-select">
                  Chart style
                </label>
                <Select
                  id="chart-style-select"
                  properties={{
                    name: 'chart-type',
                    value: chartType,
                    default: chartType
                  }}
                  options={chartOptions}
                  onChange={this.handleChartTypeChange}
                />
              </div>
            </div>
          }
          { hasGeoInfo
              && <AreaIntersectionFilter required /> }
        </div>
        { !areaIntersection
            && <p>Please select both a chart style and an area intersection to proceed.</p> }
        { areaIntersection && <p>Drag and drop elements from the list to the boxes:</p> }
        { areaIntersection && (
          <div className="actions-div">
            {fields &&
              <FieldsContainer
                dataset={dataset}
                tableName={tableName}
                fields={fields}
              />
            }
            <div className="arrow-container">
              <img alt="" src="/static/images/components/widgets/Arrow.svg" />
            </div>
            <div className="customization-container">
              <DimensionsContainer />
              <FilterContainer />
              {showOrderByContainer &&
                <SortContainer />
              }
              {showLimitContainer &&
                <LimitContainer />
              }
            </div>
          </div>
        ) }
        <div className="save-widget-container">
          <button
            type="button"
            className="c-button -secondary"
            onClick={this.handleNeedHelp}
          >
            Need help?
          </button>
          {showSaveButtonFlag && mode === 'save' &&
          <a
            role="button"
            className="c-button -primary"
            tabIndex={-2}
            onClick={this.handleSaveWidget}
          >
            Save widget
          </a>
          }
          {!showSaveButton && showNotLoggedInText &&
            <span className="not-logged-in-text">
              Please log in to save changes
            </span>
          }
          {showUpdateButton && mode === 'update' &&
          <a
            role="button"
            className="c-button -primary"
            tabIndex={0}
            onClick={this.handleUpdateWidget}
          >
            Save widget
          </a>
          }
          {tableViewMode && showEmbedTable && areaIntersection &&
            <a
              role="button"
              className="c-button -primary"
              tabIndex={0}
              onClick={this.handleEmbedTable}
            >
              Embed table
            </a>
          }
        </div>
      </div>
    );
  }
}

NEXGDDPEditor.defaultProps = {
  showEmbedTable: true
};

NEXGDDPEditor.propTypes = {
  mode: PropTypes.oneOf(['save', 'update']).isRequired,
  tableName: PropTypes.string.isRequired,
  hasGeoInfo: PropTypes.bool.isRequired,
  jiminy: PropTypes.object,
  dataset: PropTypes.string.isRequired, // Dataset ID
  datasetType: PropTypes.string,
  datasetProvider: PropTypes.string,
  tableViewMode: PropTypes.bool.isRequired,
  showNotLoggedInText: PropTypes.bool,
  showSaveButton: PropTypes.bool.isRequired,
  showEmbedTable: PropTypes.bool,
  showLimitContainer: PropTypes.bool.isRequired,
  showOrderByContainer: PropTypes.bool.isRequired,
  // Store
  widgetEditor: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  setChartType: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  // Callback
  onUpdateWidget: PropTypes.func,
  onEmbedTable: PropTypes.func
};

const mapStateToProps = ({ widgetEditor, user }) => ({ widgetEditor, user });
const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  },
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(NEXGDDPEditor);
