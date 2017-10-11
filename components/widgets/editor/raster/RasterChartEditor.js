import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import isEmpty from 'lodash/isEmpty';
import d3 from 'd3';

// Redux
import { connect } from 'react-redux';
import { setBand } from 'components/widgets/editor/redux/widgetEditor';
import { toggleModal } from 'redactions/modal';

// Components
import Select from 'components/widgets/editor/form/SelectInput';
import Spinner from 'components/widgets/editor/ui/Spinner';
import SaveWidgetModal from 'components/widgets/editor/modal/SaveWidgetModal';
import AreaIntersectionFilter from 'components/widgets/editor/ui/AreaIntersectionFilter';

// Services
import RasterService from 'components/widgets/editor/services/RasterService';

class RasterChartEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false, // Whether the component is loading
      error: null, // Whether an error happened
      /** @type {{ name: string, alias?: string, type?: string, description?: string }[]} bands */
      bands: [], // List of the bands
      bandStatsInfo: {}, // Statistical information of the selected band
      bandStatsInfoLoading: false
    };

    this.rasterService = new RasterService(props.dataset, props.tableName, props.provider);
  }

  componentDidMount() {
    this.fetchBandNames();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataset !== this.props.dataset
      || nextProps.tableName !== this.props.tableName) {
      this.rasterService = new RasterService(
        nextProps.dataset,
        nextProps.tableName,
        nextProps.provider
      );
      this.fetchBandNames();
    }
  }

  /**
   * Event handler executed when the user selects a band
   * @param {string} bandName - Name of the band
   */
  @Autobind
  onChangeBand(bandName) {
    const band = this.state.bands.find(b => b.name === bandName);
    this.props.setBand(band);

    // We fetch the stats info about the band
    this.setState({ bandStatsInfoLoading: true });
    this.rasterService.getBandStatsInfo(bandName)
      .then(bandStatsInfo => this.setState({ bandStatsInfo }))
      .catch(() => toastr.error('Error', 'Unable to fetch the statistical information of the band'))
      .then(() => this.setState({ bandStatsInfoLoading: false }));
  }

  /**
   * Event handler executed when the user clicks the
   * Save button
   */
  @Autobind
  onClickSaveWidget() {
    const { dataset, provider, tableName, title } = this.props;
    const options = {
      children: SaveWidgetModal,
      childrenProps: {
        dataset,
        datasetType: 'raster',
        datasetProvider: provider,
        tableName,
        title
      }
    };

    this.props.toggleModal(true, options);
  }

  /**
   * Event handler executed when the user clicks the
   * Save button while editing an existing widget
   */
  @Autobind
  onClickUpdateWidget() {
    this.props.onUpdateWidget();
  }

  /**
   * Fetch the name of the bands and set it in the state
   */
  fetchBandNames() {
    this.setState({ loading: true, error: null });
    this.rasterService.getBandNames()
      // We merge the band names with the information that comes from
      // the metadata of the dataset (type, alias and description)
      .then((bands) => { // eslint-disable-line arrow-body-style
        return bands.map((band) => {
          let res = { name: band };

          const bandInfo = this.props.bandsInfo[band];
          if (bandInfo) {
            res = Object.assign({}, res, bandInfo);
          } else if (this.props.provider === 'cartodb') {
            // If there's no alias for a Carto dataset, then
            // we use a prettier name than just a number
            res = Object.assign({}, res, { alias: `Band ${band}` });
          }

          return res;
        });
      })
      .then((bands) => {
        // We save the bands
        this.setState({ bands }, () => {
          // At this point, if this.props.band is defined, it's
          // because we're restoring the state of the widget editor
          // That means that this.props.band only has its name attribute
          // defined (we don't have the alias nor the description), we thus
          // need to reset the band based on the band list
          if (this.props.band) {
            this.onChangeBand(this.props.band.name);
          }
        });
      })
      .catch(({ message }) => this.setState({ error: message }))
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, bands, error, bandStatsInfo, bandStatsInfoLoading } = this.state;
    const { band, mode, showSaveButton, hasGeoInfo, showNotLoggedInText } = this.props;

    return (
      <div className="c-raster-chart-editor">
        <div className="content">
          { hasGeoInfo && <AreaIntersectionFilter /> }
          <h5>Bands { loading && <Spinner isLoading className="-light -small -inline" /> }</h5>
          { error && <div className="error"><span>Error:</span> {error}</div> }
          { !error && (
            <Select
              properties={{
                name: 'raster-bands',
                default: band && band.name
              }}
              options={bands.map(b => ({ label: b.alias || b.name, value: b.name }))}
              onChange={this.onChangeBand}
            />
          ) }
          { band && band.description && (
            <p className="description">{band.description}</p>
          ) }
          <div className="c-table stats">
            <Spinner isLoading={bandStatsInfoLoading} className="-light -small" />
            { bandStatsInfo && !isEmpty(bandStatsInfo) && (
              <table>
                <thead>
                  <tr>
                    { Object.keys(bandStatsInfo).map(name => <th key={name}>{name}</th>) }
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    { Object.keys(bandStatsInfo).map((name) => {
                      const number = d3.format('.4s')(bandStatsInfo[name]);
                      return (
                        <td key={name}>{number}</td>
                      );
                    }) }
                  </tr>
                </tbody>
              </table>
            ) }
          </div>
        </div>
        <div className="buttons">
          <span /> {/* Help align the button to the right */}
          {showSaveButton && mode === 'save' && band &&
            <button
              className="c-button -primary"
              onClick={this.onClickSaveWidget}
            >
              Save widget
            </button>
          }
          {showSaveButton && mode === 'update' && band &&
            <button
              className="c-button -primary"
              onClick={this.onClickUpdateWidget}
            >
              Save widget
            </button>
          }
          {!showSaveButton && showNotLoggedInText &&
            <span className="not-logged-in-text">
              Please log in to save changes
            </span>
          }
        </div>
      </div>
    );
  }
}

RasterChartEditor.propTypes = {
  dataset: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  hasGeoInfo: PropTypes.bool.isRequired,
  title: PropTypes.string, // Default title when saving the widget
  provider: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['save', 'update']),
  showSaveButton: PropTypes.bool,
  showNotLoggedInText: PropTypes.bool,
  onUpdateWidget: PropTypes.func,

  // REDUX
  band: PropTypes.object,
  bandsInfo: PropTypes.object,
  toggleModal: PropTypes.func.isRequired,
  setBand: PropTypes.func.isRequired
};

RasterChartEditor.defaultProps = {
  onUpdateWidget: () => {}
};

const mapStateToProps = ({ widgetEditor }) => ({
  band: widgetEditor.band,
  bandsInfo: widgetEditor.bandsInfo
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (...args) => dispatch(toggleModal(...args)),
  setBand: band => dispatch(setBand(band))
});

export default connect(mapStateToProps, mapDispatchToProps)(RasterChartEditor);
