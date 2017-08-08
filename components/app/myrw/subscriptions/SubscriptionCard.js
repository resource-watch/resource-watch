import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/vis/Map';

// Services
import DatasetService from 'services/DatasetService';
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

// Utils
import LayerManager from 'utils/layers/LayerManager';

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

class SubscriptionCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      dataset: null,
      country: null,
      layer: {}
    };

    // Services
    this.datasetService = new DatasetService(props.subscription.attributes.datasets[0],
      { apiURL: process.env.WRI_API_URL });
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    this.datasetService.fetchData()
    .then((response) => {
      const dataset = response;
      this.setState({ dataset });
      this.areasService.getCountry(this.props.subscription.attributes.params.iso.country)
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
          id: `${dataset.id}-${country.label}`,
          provider: 'geojson',
          layerConfig: {
            data: newGeoJson,
            fitBounds: true,
            bounds: JSON.parse(country.bounds)
          }
        };

        this.setState({
          loading: false,
          country: country.label,
          layer: fakeLayer
        });
      })
    })
    .catch(err => console.log(err));
  }

  @Autobind
  handleDeleteSubscription() {
    const { subscription, token } = this.props;

    if (confirm('Are you sure you want to delete the subscription?')) {
      this.setState({ loading: true });
      this.userService.deleteSubscription(subscription.id, token)
        .then(() => {
          this.props.onSubscriptionRemoved();
        })
        .catch(err => console.log(err));
    }
  }

  @Autobind
  handleGoToDataset() {
    Router.pushRoute('explore_detail', { id: this.props.subscription.attributes.datasets[0]})
  }

  render() {
    const { loading, dataset, country, layer } = this.state;
    const { subscription } = this.props;
    const confirmed = subscription.attributes.confirmed;
    const name = subscription.attributes.name;

    return (
      <div className="c-subscription-card medium-4 small-12">
        <div className="map-container">
          <Map
            LayerManager={LayerManager}
            mapConfig={mapConfig}
            layersActive={[layer]}
          />
        </div>
        <Spinner isLoading={loading} className="-small -light -relative -center" />
        <div className="name-container">
          <h4>{name}</h4>
        </div>
        <div className="data-container">
          <div className="location-container">
            <h5>Location</h5>
            {country}
          </div>
          <div className="dataset-container">
            <h5>Dataset</h5>
            {dataset && dataset.attributes.name}
          </div>
        </div>
        <div className="actions-div">
          {confirmed &&
            <a
              tabIndex={-1}
              role="button"
              onClick={this.handleGoToDataset}
            >
              Go to Dataset
            </a>
          }
          {!confirmed &&
            <span className="pending-label">
              Pending
            </span>
          }
          <a
            tabIndex={-1}
            role="button"
            onClick={this.handleDeleteSubscription}
          >
            Delete
          </a>
        </div>
      </div>
    );
  }

}

SubscriptionCard.propTypes = {
  token: PropTypes.string.isRequired,
  subscription: PropTypes.object.isRequired,
  // Callbacks
  onSubscriptionRemoved: PropTypes.func.isRequired
};

export default SubscriptionCard;
