import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

import { toggleModal, setModalOptions } from 'redactions/modal';
import { setChartType, setAreaIntersection } from 'components/widgets/editor/redux/widgetEditor';

// Components
import FilterContainer from 'components/widgets/editor/ui/FilterContainer';
import DimensionsContainer from 'components/widgets/editor/ui/DimensionsContainer';
import FieldsContainer from 'components/widgets/editor/ui/FieldsContainer';
import SortContainer from 'components/widgets/editor/ui/SortContainer';
import LimitContainer from 'components/widgets/editor/ui/LimitContainer';
import CustomSelect from 'components/widgets/editor/ui/CustomSelect';
import Select from 'components/widgets/editor/form/SelectInput';
import SaveWidgetModal from 'components/widgets/editor/modal/SaveWidgetModal';
import HowToWidgetEditorModal from 'components/widgets/editor/modal/HowToWidgetEditorModal';
import UploadAreaIntersectionModal from 'components/widgets/editor/modal/UploadAreaIntersectionModal';
import Spinner from 'components/widgets/editor/ui/Spinner';

// Services
import AreasService from 'components/widgets/editor/services/AreasService';
import UserService from 'components/widgets/editor/services/UserService';

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
      areaOptions: [],
      loadingAreaIntersection: false,
      loadingUserAreas: false
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  /**
  * COMPONENT LIFECYCLE
  * - componentDidMount
  */
  componentDidMount() {
    if (this.props.hasGeoInfo) {
      this.fetchAreas();
      if (this.props.user.id) { // Only try to load the user areas when an user is logged in
        this.fetchUserAreas();
      }
    }
  }

  /**
   * Event handler executed when the selected area
   * intersection is changed
   * @param {{ label: string, value: string }} item Option of the selector
   */
  @Autobind
  async onChangeAreaIntersection(item) {
    return new Promise((resolve) => {
      // The user unselected the option
      if (!item) {
        this.props.setAreaIntersection(null);
      } else if (item.value === 'upload') {
        this.props.toggleModal(true, {
          children: UploadAreaIntersectionModal,
          childrenProps: {
            onUploadArea: (id) => {
              // We close the modal
              this.props.toggleModal(false, {});

              // We save the ID of the area
              this.props.setAreaIntersection(id);

              resolve(true);
            }
          },
          onCloseModal: () => resolve(false)
        });
      } else {
        // The user selected a custom area that is not a country
        this.props.setAreaIntersection(item.value);
        resolve(true);
      }
    });
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
        datasetType: this.props.datasetType,
        datasetProvider: this.props.datasetProvider,
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

  @Autobind
  handleEmbedTable() {
    this.props.onEmbedTable();
  }

  /**
   * Fetch the list of the areas for the area intersection
   * filter
   */
  fetchAreas() {
    this.setState({ loadingAreaIntersection: true });

    // When this resolves, we'll also be able to display the countries
    this.areasService.fetchCountries()
      .then((data) => {
        this.setState({
          areaOptions: [...this.state.areaOptions, ...AREAS,
            ...data.map(elem => ({ label: elem.name || '', value: elem.geostoreId }))]
        });
      })
      // We don't really care if the countries don't load, we can still
      // let the user use a custom area
      .catch(err => toastr.error('Error', err))
      .then(() => this.setState({ loadingAreaIntersection: false }));
  }

  /**
   * Fetchs the user areas
   */
  fetchUserAreas() {
    this.setState({ loadingUserAreas: true });
    this.userService.getUserAreas(this.props.user.token)
      .then((response) => {
        const userAreas = response.map(val => ({
          label: val.attributes.name,
          value: val.attributes.geostore
        }));
        this.setState({
          loadingUserAreas: false,
          areaOptions: [...this.state.areaOptions, ...userAreas]
        });
      })
      .catch((err) => {
        this.setState({ loadingUserAreas: false });
        toastr.error('Error loading user areas', err);
      });
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
      showOrderByContainer
    } = this.props;
    const { chartType, fields, category, value, areaIntersection } = widgetEditor;
    const { areaOptions, loadingAreaIntersection } = this.state;
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
          {hasGeoInfo &&
            <div className="area-intersection">
              <div className="c-field">
                <label htmlFor="area-intersection-select">
                  Area intersection { loadingAreaIntersection && <Spinner isLoading className="-light -small -inline" /> }
                </label>
                <CustomSelect
                  id="area-intersection-select"
                  placeholder="Select area"
                  options={areaOptions}
                  default={areaIntersection}
                  onValueChange={this.onChangeAreaIntersection}
                  allowNonLeafSelection={false}
                  waitForChangeConfirmation
                />
              </div>
            </div>
          }
        </div>
        <p>Drag and drop elements from the list to the boxes:</p>
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
          {tableViewMode && showEmbedTable &&
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

ChartEditor.defaultProps = {
  showEmbedTable: true
};

ChartEditor.propTypes = {
  mode: PropTypes.oneOf(['save', 'update']).isRequired,
  tableName: PropTypes.string.isRequired,
  hasGeoInfo: PropTypes.bool.isRequired,
  jiminy: PropTypes.object,
  dataset: PropTypes.string.isRequired, // Dataset ID
  datasetType: PropTypes.string,
  datasetProvider: PropTypes.string,
  tableViewMode: PropTypes.bool.isRequired,
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
  setAreaIntersection: PropTypes.func.isRequired,
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
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  setAreaIntersection: id => dispatch(setAreaIntersection(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartEditor);
