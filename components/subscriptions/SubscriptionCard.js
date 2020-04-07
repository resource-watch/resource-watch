import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/widgets/map/Map';

// Services
import { fetchDataset } from 'services/dataset';
import { fetchGeostore, fetchCountry } from 'services/geostore';
import { deleteSubscription } from 'services/subscriptions';

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

class SubscriptionCard extends React.Component {
  state = {
    loading: false,
    dataset: null,
    country: null,
    type: this.props.subscription.datasetsQuery[0].type
  };

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { subscription } = this.props;
    const datasetId = subscription.datasetsQuery[0].id;
    this.setState({ loading: true });
    fetchDataset(datasetId)
      .then((response) => {
        const dataset = response;
        this.setState({ dataset });
        const paramsObj = subscription.params;

        if (paramsObj.geostore) {
          fetchGeostore(paramsObj.geostore)
            .then((res) => {
              const obj = res.data;
              const fakeLayer = {
                id: `${dataset.id}-${obj.id}`,
                provider: 'geojson',
                layerConfig: {
                  data: obj.geojson,
                  fitBounds: true,
                  bounds: obj.bbox
                }
              };

              this.setState({
                loading: false,
                country: obj.id,
                layerGroups: [{
                  dataset,
                  visible: true,
                  layers: [fakeLayer]
                }]
              });
            });
        } else if (paramsObj.iso.country) {
          fetchCountry(paramsObj.iso.country)
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
      })
      .catch(err => toastr.error('Error', err));
  }

  handleDeleteSubscription = () => {
    const { subscription, token } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.setState({ loading: true });
        deleteSubscription(subscription.id, token)
          .then(() => {
            this.props.onSubscriptionRemoved();
          })
          .catch(err => toastr.error('Error', err));
      }
    };
    toastr.confirm('Are you sure you want to delete the subscription?', toastrConfirmOptions);
  }

  handleGoToDataset = () => {
    Router.pushRoute('explore', { dataset: this.props.subscription.datasets[0] });
  }

  render() {
    const {
      loading,
      dataset,
      country,
      layerGroups,
      type
    } = this.state;

    const { subscription } = this.props;
    const { confirmed, name } = subscription;

    return (
      <div className="c-subscription-card">
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
            <div className="data-container">
              <div className="location-container">
                <h5>Location</h5>
                {country}
              </div>
              <div className="dataset-container">
                <h5>Dataset</h5>
                {dataset && dataset.name}
              </div>
              <div className="type-container">
                <h5>Type</h5>
                {type}
              </div>
            </div>
            <div className="actions-div">
              {confirmed &&
                <a
                  tabIndex={-1}
                  role="button"
                  onClick={this.handleGoToDataset}
                  onKeyPress={this.handleGoToDataset}
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
                onKeyPress={this.handleDeleteSubscription}
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

SubscriptionCard.propTypes = {
  token: PropTypes.string.isRequired,
  subscription: PropTypes.object.isRequired,
  // Callbacks
  onSubscriptionRemoved: PropTypes.func.isRequired
};

export default SubscriptionCard;
