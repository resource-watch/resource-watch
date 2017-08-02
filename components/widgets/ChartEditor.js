import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { setChartType, setAreaIntersection } from 'redactions/widgetEditor';

// Components
import FilterContainer from 'components/widgets/FilterContainer';
import DimensionsContainer from 'components/widgets/DimensionsContainer';
import FieldsContainer from 'components/widgets/FieldsContainer';
import SortContainer from 'components/widgets/SortContainer';
import LimitContainer from 'components/widgets/LimitContainer';
import CustomSelect from 'components/ui/CustomSelect';
import Select from 'components/form/SelectInput';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';
import HowToWidgetEditorModal from 'components/modal/HowToWidgetEditorModal';
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

const AREAS = [
  {
    label: 'Custom area',
    value: 'custom',
    items: [
      {
        label: 'Upload new area',
        value: 'upload',
        as: 'Custom area'
      }
    ]
  }
];

@DragDropContext(HTML5Backend)
class ChartEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      areaOptions: []
    };
  }

  componentWillMount() {
    this.fetchAreas();
  }

  /**
   * Event handler executed when the selected area
   * intersection is changed
   * @param {{ label: string, value: string }} item Option of the selector
   */
  @Autobind
  onChangeAreaIntersection(item) {
    if (!item) {
      this.props.setAreaIntersection(null);
    } else if (item.value === 'upload') {
      this.props.toggleModal(true, {
        children: UploadAreaIntersectionModal,
        childrenProps: {
          onUploadArea: this.onUploadArea
        },
        onCloseModal: this.onCloseUploadAreaModal
      });
    }
  }

  /**
   * Callback executed when the user has successfully
   * uploaded an area
   * @param {string} id ID of the geostore's object
   */
  @Autobind
  onUploadArea(id) {
    // We close the modal
    this.props.toggleModal(false, {});

    // We save the ID of the area
    this.props.setAreaIntersection(id);
  }

  /**
   * Callback executed when the user closes the modal
   * that lets them upload an area
   */
  @Autobind
  onCloseUploadAreaModal() {
    if (this.resetAreaIntersection) {
      // FIXME: this doesn't work when an area is already selected
      // then the user clicks the "upload" option and close the modal
      // the selector should stay with the previous area
      this.resetAreaIntersection();
      this.props.setAreaIntersection(null);
    }
  }

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

  /**
   * Fetch the list of the areas for the area intersection
   * filter
   */
  fetchAreas() {
    this.setState({ areaOptions: AREAS });
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
    const { areaOptions } = this.state;

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
        <div className="selectors-container">
          {!tableViewMode &&
            <div className="chart-type">
              <h5>Chart style</h5>
              <Select
                properties={{
                  name: 'chart-type',
                  value: chartType,
                  default: chartType
                }}
                options={chartOptions}
                onChange={this.handleChartTypeChange}
              />
            </div>
          }
          <div className="area-intersection">
            <h5>Area intersection</h5>
            <CustomSelect
              placeholder="Select area"
              options={areaOptions}
              onValueChange={this.onChangeAreaIntersection}
              allowNonLeafSelection={false}
              getResetCallback={(func) => { this.resetAreaIntersection = func; }}
            />
          </div>
        </div>
        <div className="text-container">
          Drag and drop elements from the list to the boxes:
        </div>
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
            role="button"
            tabIndex={-2}
            onClick={this.handleSaveWidget}
          >
            Save widget
          </a>
          }
          {mode === 'update' &&
          <a
            role="button"
            tabIndex={-1}
            onClick={this.handleShareEmbed}
          >
            Share/embed
          </a>
          }
          {showUpdateButton && mode === 'update' &&
          <a
            role="button"
            tabIndex={0}
            onClick={this.handleUpdateWidget}
          >
            Save widget
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
  setAreaIntersection: PropTypes.func.isRequired,
  // Callback
  onUpdateWidget: PropTypes.func
};

const mapStateToProps = ({ widgetEditor, user }) => ({ widgetEditor, user });
const mapDispatchToProps = dispatch => ({
  setChartType: (type) => {
    dispatch(setChartType(type));
  },
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setAreaIntersection: id => dispatch(setAreaIntersection(id))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ChartEditor);
