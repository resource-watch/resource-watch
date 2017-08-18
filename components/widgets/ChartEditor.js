import React from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { Autobind } from 'es-decorators';
import { DragDropContext } from 'react-dnd';

// Redux
import { connect } from 'react-redux';

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
import Spinner from 'components/ui/Spinner';

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
  /**
   * Return the geostore id associated with the country's ISO
   * NOTE: errors are not caught intentionally
   * @param {string} iso Valid 3-letter ISO
   * @returns {Promise<string>}
   */
  static getCountryGeostoreId(iso) {
    return fetch(`${process.env.WRI_API_URL}/geostore/admin/${iso}`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(`Unable to get the geostore id associated with the ISO ${iso}`);
      })
      .then(({ data }) => data.id);
  }

  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaIntersection: false
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
      } else { // We assume the user selected a country
        this.setState({ loadingAreaIntersection: true });

        ChartEditor.getCountryGeostoreId(item.value)
          .then((id) => {
            this.props.setAreaIntersection(id);
            resolve(true);
          })
          .catch((err) => {
            console.error(err);

            // In case of an error, we prevent the selector from setting
            // the area as selected
            resolve(false);

            // TODO: improve this 💩
            alert('Unable to filter with this country.'); // eslint-disable-line no-alert
          })
          .then(() => this.setState({ loadingAreaIntersection: false }));
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

  /**
   * Fetch the list of the areas for the area intersection
   * filter
   */
  fetchAreas() {
    this.setState({ loadingAreaIntersection: true });

    // When this resolves, we'll also be able to display the countries
    fetch(`${process.env.WRI_API_URL}/query/134caa0a-21f7-451d-a7fe-30db31a424aa?sql=SELECT iso as value, name_engli as label from gadm28_countries order by name_engli asc`)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error('Unable to load the list of countries for the Intersection Area selector.');
      })
      .then(({ data }) => this.setState({ areaOptions: [...AREAS, ...data] }))
      // We don't really care if the countries don't load, we can still
      // let the user use a custom area
      .catch(err => console.error(err))
      .then(() => this.setState({ loadingAreaIntersection: false }));
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
      showShareEmbedButton
    } = this.props;
    const { chartType, fields, category, value } = widgetEditor;
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
                <label>Chart style</label>
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
            </div>
          }
          <div className="area-intersection">
            <div className="c-field">
              <label>Area intersection { loadingAreaIntersection && <Spinner isLoading className="-light -small -inline" /> }</label>
              <CustomSelect
                placeholder="Select area"
                options={areaOptions}
                onValueChange={this.onChangeAreaIntersection}
                allowNonLeafSelection={false}
                waitForChangeConfirmation
              />
            </div>
          </div>
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
            <SortContainer />
            <LimitContainer />
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
          {mode === 'update' && showShareEmbedButton &&
          <a
            role="button"
            className="c-button -primary"
            tabIndex={-1}
            onClick={this.handleShareEmbed}
          >
            Share/embed
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
        </div>
      </div>
    );
  }
}

ChartEditor.defaultProps = {
  showShareEmbedButton: false
};

ChartEditor.propTypes = {
  mode: PropTypes.oneOf(['save', 'update']).isRequired,
  tableName: PropTypes.string.isRequired,
  jiminy: PropTypes.object,
  dataset: PropTypes.string.isRequired, // Dataset ID
  datasetType: PropTypes.string,
  datasetProvider: PropTypes.string,
  tableViewMode: PropTypes.bool.isRequired,
  showShareEmbedButton: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(ChartEditor);
