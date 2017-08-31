import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/vis/Map';
import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';

// Services
import DatasetService from 'services/DatasetService';
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Utils
import LayerManager from 'utils/layers/LayerManager';

const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};

class AreaCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      country: null,
      layer: {}
    };

    // Services
    this.datasetService = new DatasetService(null,
      { apiURL: process.env.WRI_API_URL });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    const attsObj = this.props.area.attributes;

    if (attsObj.geostore) {
      this.areasService.getGeostore(attsObj.geostore)
        .then((res) => {
          const obj = res.data;
          const fakeLayer = {
            id: `${obj.id}`,
            provider: 'geojson',
            layerConfig: {
              data: obj.attributes.geojson,
              fitBounds: true,
              bounds: obj.attributes.bbox
            }
          };

          this.setState({
            loading: false,
            country: obj.id,
            layer: fakeLayer
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

  @Autobind
  handleNewSubscription() {
    const options = {
      children: AreaSubscriptionModal,
      childrenProps: {
        area: this.props.area,
        toggleModal: this.props.toggleModal,
        onSubscriptionCreated: this.handleSubscriptionCreated,
        mode: 'new'
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  @Autobind
  handleEditSubscription() {
    const options = {
      children: AreaSubscriptionModal,
      childrenProps: {
        area: this.props.area,
        toggleModal: this.props.toggleModal,
        onSubscriptionUpdated: this.handleSubscriptionUpdated,
        mode: 'edit'
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  @Autobind
  handleRemoveSubscription() {
    const { area, token } = this.props;
    toastr.confirm(`Area you sure you want to remove the subscription to the area: ${area.attributes.name}?`, {
      onOk: () => {
        this.setState({ loading: true });
        this.userService.deleteSubscription(area.subscription.id, token)
          .then(() => {
            this.setState({ loading: false });
            toastr.success('Success', 'The subscription was removed successfully');
            this.props.onChange();
          })
          .catch((err) => {
            this.setState({ loading: false });
            toastr.error('Error removing subscription', err);
          });
      }
    });
  }

  @Autobind
  handleSubscriptionCreated() {
    this.props.onChange();
  }

  @Autobind
  handleSubscriptionUpdated() {
    this.props.onChange();
  }

  @Autobind
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

  render() {
    const { loading, layerGroups } = this.state;
    const { area } = this.props;
    const name = area.attributes.name;
    const subscription = area.subscription;
    const subscriptionConfirmed = area.subscription && area.subscription.attributes.confirmed;

    return (
      <div className="c-area-card">
        <div className="border-container">
          <div className="map-container">
            <Map
              LayerManager={LayerManager}
              mapConfig={MAP_CONFIG}
              layerGroups={layerGroups || []}
              interactionEnabled={false}
            />
          </div>
          <Spinner isLoading={loading} className="-small -light -relative -center" />
          <div className="text-container">
            <div className="name-container">
              <h4>{name}</h4>
            </div>
            <div className="subscriptions-container">
              <h4>Subscriptions</h4>
              {subscription &&
                <div className="datasets-container">
                  <h5>Datasets</h5>
                  <div className="datasets-list">
                    {subscription.attributes.datasets.map((datasetObj, index) =>
                      (<div
                        className="dataset-element"
                        key={`${datasetObj}-${index}`} // eslint-disable-line
                      >
                        <div className="dataset-name">
                          {datasetObj.label}
                        </div>
                        <div className="dataset-subscription-type">
                          {subscription.attributes.datasetsQuery
                            .find(elem => elem.id === datasetObj.id).type}
                        </div>
                      </div>)
                    )}
                  </div>
                </div>
              }
              {subscription &&
                <div className="subscription-actions">
                  <div className="status-labels-container">
                    <div className="status-label">
                      {subscriptionConfirmed &&
                      <div className="confirmed-label">
                            Confirmed
                      </div>
                      }
                      {!subscriptionConfirmed &&
                      <div className="pending-label">
                            Pending
                      </div>
                      }
                    </div>
                  </div>
                  <div className="subscription-buttons">
                    <a
                      tabIndex={-1}
                      role="button"
                      onClick={this.handleRemoveSubscription}
                    >
                        Delete
                    </a>
                    <a
                      tabIndex={-1}
                      role="button"
                      onClick={this.handleEditSubscription}
                    >
                        Edit
                    </a>
                  </div>
                </div>
              }
              {!subscription &&
                <div className="new-subscription-container">
                  <a
                    tabIndex={-1}
                    role="button"
                    onClick={this.handleNewSubscription}
                  >
                    New
                  </a>
                </div>
              }
            </div>
            <div className="actions-div">
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

AreaCard.propTypes = {
  token: PropTypes.string.isRequired,
  area: PropTypes.object.isRequired,
  // Callbacks
  onAreaRemoved: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  // Store
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(null, mapDispatchToProps)(AreaCard);
