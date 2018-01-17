import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Link, Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/widgets/editor/map/Map';
import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';
import AreaActionsTooltip from 'components/areas/AreaActionsTooltip';

// Services
import DatasetService from 'services/DatasetService';
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Utils
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

class AreaCard extends React.Component {
  /**
   * Return the position of the click within the page taking
   * into account the scroll (relative to the page, not the
   * viewport )
   * @static
   * @param {MouseEvent} e Event
   * @returns {{ x: number, y: number }}
   */
  static getClickPosition(e) {
    return {
      x: window.scrollX + e.clientX,
      y: window.scrollY + e.clientY
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      country: null,
      layer: {}
    };

    // Services
    this.datasetService = new DatasetService(null, {
      apiURL: process.env.WRI_API_URL,
      language: props.locale
    });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleEditSubscription = this.handleEditSubscription.bind(this);
    this.handleSubscriptionCreated = this.handleSubscriptionCreated.bind(this);
    this.handleSubscriptionUpdated = this.handleSubscriptionUpdated.bind(this);
    this.handleDeleteArea = this.handleDeleteArea.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleEditArea = this.handleEditArea.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    const {
      openSubscriptionsModal,
      subscriptionThreshold,
      subscriptionType,
      subscriptionDataset
    } = this.props;
    this.loadData();
    if (openSubscriptionsModal) {
      this.handleEditSubscription(subscriptionDataset, subscriptionType, subscriptionThreshold);
    }
  }

  loadData() {
    this.setState({ loading: true });
    const attsObj = this.props.area.attributes;

    if (attsObj.geostore) {
      this.areasService.getGeostore(attsObj.geostore)
        .then((res) => {
          const obj = res.data;
          const bounds = [
            [obj.attributes.bbox[0], obj.attributes.bbox[1]],
            [obj.attributes.bbox[2], obj.attributes.bbox[3]]
          ];
          const fakeLayer = {
            id: `${obj.id}`,
            provider: 'geojson',
            active: true,
            layerConfig: {
              data: obj.attributes.geojson,
              fitBounds: true,
              bounds: { type: 'Polygon', coordinates: [bounds] }
            }
          };

          this.setState({
            loading: false,
            country: obj.id,
            layerGroups: [{
              dataset: null,
              visible: true,
              layers: [fakeLayer]
            }]
          });
        });
    } else if (attsObj.iso.country) {
      this.areasService.getCountry(attsObj.iso.country)
        .then((res) => {
          const country = res.data[0];
          const newGeoJson = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: JSON.parse(country.geojson)
              }
            ]
          };

          const fakeLayer = {
            id: `-${country.label}`,
            provider: 'geojson',
            active: true,
            layerConfig: {
              data: newGeoJson,
              fitBounds: true,
              bounds: JSON.parse(country.bounds)
            }
          };

          this.setState({
            loading: false,
            country: country.label,
            layerGroups: [{
              dataset: null,
              visible: true,
              layers: [fakeLayer]
            }]
          });
        });
    }
  }

  handleEditArea() {
    Router.pushRoute('myrw_detail', { id: this.props.area.id, tab: 'areas' });
  }

  handleEditSubscription(
    subscriptionDataset = null,
    subscriptionType = null,
    subscriptionThreshold = null
  ) {
    const mode = this.props.area.subscription ? 'edit' : 'new';
    const options = {
      children: AreaSubscriptionModal,
      childrenProps: {
        area: this.props.area,
        toggleModal: this.props.toggleModal,
        onSubscriptionUpdated: this.handleSubscriptionUpdated,
        onSubscriptionCreated: this.handleSubscriptionUpdated,
        mode,
        subscriptionDataset,
        subscriptionType,
        subscriptionThreshold
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  handleSubscriptionCreated() {
    this.props.onChange();
  }

  handleSubscriptionUpdated() {
    this.props.onChange();
  }

  handleDeleteArea() {
    const { area, token } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.setState({ loading: true });

        // Delete subscription associated to area if there's one
        if (area.subscription) {
          this.userService.deleteSubscription(area.subscription.id, token)
            .then(() => {
              this.userService.deleteArea(area.id, token)
                .then(() => {
                  this.props.onAreaRemoved();
                })
                // Fetch throws an error for some reason but the request is successful...
                .catch(err => this.props.onAreaRemoved()); // eslint-disable-line
            })
            .catch((err) => {
              this.setState({ loading: false });
              toastr.error('Error removing area', err);
            });
        } else {
          this.userService.deleteArea(area.id, token)
            .then(() => {
              this.props.onAreaRemoved();
            })
            // Fetch throws an error for some reason but the request is successful...
            .catch(err => this.props.onAreaRemoved()); // eslint-disable-line
        }
      }
    };
    toastr.confirm(`Are you sure you want to delete the area ${area.attributes.name}?
      Deleting an area will delete all the subscriptions associated to it`, toastrConfirmOptions);
  }

  handleEdit(event) {
    const position = AreaCard.getClickPosition(event);
    this.props.toggleTooltip(true, {
      follow: false,
      position,
      children: AreaActionsTooltip,
      childrenProps: {
        toggleTooltip: this.props.toggleTooltip,
        onEditArea: this.handleEditArea,
        onEditSubscriptions: this.handleEditSubscription
      }
    });
  }

  render() {
    const { loading, layerGroups } = this.state;
    const { area } = this.props;
    const name = area.attributes.name;
    const subscription = area.subscription;
    const subscriptionConfirmed = area.subscription && area.subscription.attributes.confirmed;

    const borderContainerClassNames = classnames({
      'border-container': true,
      'blue-background': subscription && !subscriptionConfirmed
    });

    return (
      <div className="c-area-card">
        <div className={borderContainerClassNames}>
          <div className="map-container">
            <Map
              LayerManager={LayerManager}
              mapConfig={MAP_CONFIG}
              layerGroups={layerGroups || []}
              interactionEnabled={false}
              useLightBasemap
            />
          </div>
          <Spinner isLoading={loading} className="-small -light -relative -center" />
          <div className="text-container">
            <div className="name-container">
              <h4>{name}</h4>
            </div>
            <div className="subscriptions-container">
              {subscription &&
                <div className="datasets-container">
                  <div className="datasets-list">
                    {subscription.attributes.datasets.map((datasetObj, index) =>
                      (<div
                        className="dataset-element"
                        key={`${datasetObj}-${index}`} // eslint-disable-line
                      >
                        <div className="dataset-name">
                          <Link
                            route={'explore_detail'}
                            params={{ id: datasetObj.id }}
                          >
                            <a>
                              {datasetObj.label}
                            </a>
                          </Link>
                        </div>
                        <div className="dataset-subscription-type">
                          {subscription.attributes.datasetsQuery
                            .find(elem => elem.id === datasetObj.id).type}
                          &nbsp;(&ge;{subscription.attributes.datasetsQuery
                            .find(elem => elem.id === datasetObj.id).threshold})
                        </div>
                      </div>)
                    )}
                  </div>
                </div>
              }
              {subscription &&
                <div className="subscription-status">
                  <div className="status-label">
                    {!subscriptionConfirmed &&
                    <div className="pending-label">
                      Pending email confirmation
                    </div>
                    }
                  </div>
                </div>
              }
            </div>
            <div className="actions-div">
              <button
                className="c-btn -b -compressed"
                onClick={this.handleEdit}
              >
                Edit
              </button>
              <a
                tabIndex={-1}
                role="button"
                onClick={this.handleDeleteArea}
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AreaCard.defaultProps = {
  openSubscriptionsModal: false
};

AreaCard.propTypes = {
  token: PropTypes.string.isRequired,
  area: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired,
  openSubscriptionsModal: PropTypes.bool,
  subscriptionThreshold: PropTypes.number,
  subscriptionType: PropTypes.string,
  subscriptionDataset: PropTypes.string,
  // Callbacks
  onAreaRemoved: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  // Store
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreaCard);
