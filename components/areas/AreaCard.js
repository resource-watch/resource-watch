import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/vis/Map';

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
    //this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    this.datasetService.fetchData()
    .then((response) => {
      const dataset = response;
      this.setState({ dataset });
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
    .catch(err => console.log(err));
  }

  @Autobind
  handleDeleteSubscription() {
    const { subscription, token } = this.props;
    const toastrConfirmOptions = {
      onOk: () => {
        this.setState({ loading: true });
        this.userService.deleteSubscription(subscription.id, token)
          .then(() => {
            this.props.onSubscriptionRemoved();
          })
          .catch(err => console.log(err));
      }
    };
    toastr.confirm('Are you sure you want to delete the subscription?', toastrConfirmOptions);
  }

  render() {
    const { loading, dataset, country, layerGroups, type } = this.state;
    const { area } = this.props;
    const name = area.attributes.name;

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
                {dataset && dataset.attributes.name}
              </div>
              <div className="type-container">
                <h5>Type</h5>
                {type}
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

export default AreaCard;
