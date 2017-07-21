import React from 'react';
import { Autobind } from 'es-decorators';
import { Link } from 'routes';

// Layout
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/ui/Spinner';
import Map from 'components/vis/Map';
import Legend from 'components/ui/Legend';

// Services
import LayersService from 'services/LayersService';

// Utils
import LayerManager from 'utils/layers/LayerManager';

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

export default class EmbedLayer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      layer: null,
      loading: true,
      layersActive: [{ id: this.props.url.query.id }]
    };

    // LayersService
    this.layersService = new LayersService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.layersService.fetchData({ id: this.props.url.query.id }).then((data) => {
      this.setState({
        loading: false,
        layer: data
      });
    });
  }

  @Autobind
  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  render() {
    const { layer, loading } = this.state;

    console.log('layer', layer);

    // <Legend
    //   layersActive={this.state.layersActive}
    //   layersHidden={this.props.explore.datasets.hidden}
    //   className={{ color: '-dark' }}
    //   setDatasetsActive={this.props.setDatasetsActive}
    //   toggleDatasetActive={this.props.toggleDatasetActive}
    //   setDatasetsHidden={this.props.setDatasetsHidden}
    //   toggleModal={this.props.toggleModal}
    //   setModalOptions={this.props.setModalOptions}
    // />

    return (
      <div className="c-embed-layer">
        <Head
          title={layer && layer.attributes.name}
          description={layer && layer.attributes.name}
        />
        <Spinner
          isLoading={loading}
          className="-light"
        />
        {layer &&
          <div className="container">
            <Map
              LayerManager={LayerManager}
              mapConfig={mapConfig}
              layersActive={this.state.layersActive}
            />
            <div className="info">
              <div className="layer-title">
                <h2>
                  <Link
                    route="explore_detail"
                    params={{ id: layer.attributes.dataset }}
                  >
                    <a>{layer.attributes.name}</a>
                  </Link>
                </h2>
              </div>
              <div className="layer-description">
                {layer.attributes.description}
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

EmbedLayer.propTypes = {
  url: React.PropTypes.object.isRequired
};
