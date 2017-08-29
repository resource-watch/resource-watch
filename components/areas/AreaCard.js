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
    // this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    const paramsObj = this.props.subscription.attributes.params;

    if (paramsObj.geostore) {
      this.areasService.getGeostore(paramsObj.geostore)
        .then((res) => {
          const obj = res.data;
          const fakeLayer = {
            id: `${dataset.id}-${obj.id}`,
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
    } else if (paramsObj.iso.country) {
      this.areasService.getCountry(paramsObj.iso.country)
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
              dataset,
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
        area: this.props.area
      }
    };
    this.props.toggleModal(true);
    this.props.setModalOptions(options);
  }

  @Autobind
  handleDeleteArea() {
    const { area, token } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.setState({ loading: true });
        this.userService.deleteArea(area.id, token)
          .then(() => {
            this.props.onAreaRemoved();
          })
          // Fetch throws an error for some reason but the request is successful...
          .catch(err => this.props.onAreaRemoved()); // eslint-disable-line
      }
    };
    toastr.confirm(`Are you sure you want to delete the area ${area.attributes.name}?
      Deleting an area will delete all the subscriptions associated to it`, toastrConfirmOptions);
  }

  render() {
    const { loading, layerGroups } = this.state;
    const { area } = this.props;
    const name = area.attributes.name;

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
              <div className="subscription-actions">
                <a
                  tabIndex={-1}
                  role="button"
                  onClick={this.handleNewSubscription}
                >
                  New
                </a>
              </div>
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
  onAreaRemoved: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(null, mapDispatchToProps)(AreaCard);
