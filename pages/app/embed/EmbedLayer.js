import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
// import { Link } from 'routes';

// Layout
import Page from 'components/app/layout/Page';
import Head from 'components/app/layout/head';

// Components
import Spinner from 'components/widgets/editor/ui/Spinner';
import Tooltip from 'components/ui/Tooltip';
import Modal from 'components/ui/Modal';
import Icons from 'components/app/layout/icons';
import Map from 'components/widgets/editor/map/Map';
import Legend from 'components/widgets/editor/ui/Legend';

// Services
import DatasetService from 'services/DatasetService';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { getLayerGroups } from 'selectors/explore/layersExplore';

// Utils
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

const mapConfig = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  }
};

class EmbedLayer extends Page {
  constructor(props) {
    super(props);

    this.state = {
      apiLayers: [], // List of layers from the API
      layerGroups: [],
      loading: false,
      error: null,
      modalOpen: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  componentWillMount() {
    // FIXME: this is a hack to apply specific styles to
    // the embed page
    if (typeof window !== 'undefined') {
      document.body.classList.add('embed-layer-page');
    }

    this.fetchLayers();
  }

  @Autobind
  triggerToggleLoading(loading) {
    this.setState({ loading });
  }

  /**
   * Event handler executed when the user toggles the
   * visibility of a layer group
   * @param {LayerGroup} layerGroup - Layer group to toggle
   */
  onToggleLayerGroupVisibility(layerGroup) {
    const layerGroups = this.state.layerGroups.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return Object.assign({}, l, { visible: !layerGroup.visible });
    });

    this.setState({ layerGroups: [...layerGroups] });
  }

  /**
   * Event handler executed when the user changes the order
   * of the layer groups in the legend
   * @param {LayerGroup[]} layerGroups - List of layer groups
   */
  onSetLayerGroupsOrder(layerGroups) {
    this.setState({
      layerGroups: getLayerGroups(
        this.state.apiLayers,
        layerGroups.map(d => this.state.layerGroups.find(l => l.dataset === d))
      )
    });
  }

  /**
   * Change the active layer within a layer group
   * @param {string} dataset - Dataset ID of the layer group
   * @param {string} layer - ID of the layer to set as active
   */
  onSetLayerGroupActiveLayer(dataset, layer) {
    const layerGroups = this.state.layerGroups.map((l) => {
      if (l.dataset !== dataset) return l;
      const layers = l.layers.map((la) => { // eslint-disable-line arrow-body-style
        return Object.assign({}, la, { active: la.id === layer });
      });
      return Object.assign({}, l, { layers });
    });

    this.setState({ layerGroups: [...layerGroups] });
  }

  fetchLayers() {
    this.setState({ loading: true, error: null });

    try {
      const layerGroups = JSON.parse(decodeURIComponent(this.props.url.query.layers));
      // We actually fetch the datasets so we can reuse the explore selector
      DatasetService.getDatasets(layerGroups.map(l => l.dataset), 'layer')
        .then(layers => this.setState({
          apiLayers: layers,
          layerGroups: getLayerGroups(layers, layerGroups)
        }))
        .catch(err => this.setState({ error: err.message }))
        .then(() => this.setState({ loading: false }));
    } catch (e) {
      this.setState({
        loading: false,
        error: e.message
      });
    }
  }

  render() {
    return (
      <div className="c-embed-layer">
        <Head
          description={'Name' || 'Loading..'}
        />
        <Tooltip />

        { this.state.error
          && <div className="message">
            <div className="error">Unable to load the map <span>{this.state.error}</span></div>
          </div>
        }

        <Spinner
          isLoading={this.state.loading}
          className="-light"
        />
        {!!this.state.layerGroups.length &&
          <div className="container">
            <div className="map-container">
              <Map
                LayerManager={LayerManager}
                mapConfig={mapConfig}
                layerGroups={this.state.layerGroups}
              />
              <Legend
                layerGroups={this.state.layerGroups}
                className={{ color: '-dark' }}
                toggleLayerGroupVisibility={
                  layerGroup => this.onToggleLayerGroupVisibility(layerGroup)
                }
                setLayerGroupsOrder={layerGroups => this.onSetLayerGroupsOrder(layerGroups)}
                setLayerGroupActiveLayer={
                  (dataset, layer) => this.onSetLayerGroupActiveLayer(dataset, layer)
                }
                expanded={false}
                readonly
              />
            </div>
            {/* <div className="info">
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
            </div> */}
          </div>
        }

        <Modal
          open={this.state.modalOpen}
          options={this.props.modal.options}
          loading={this.props.modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Icons />
      </div>
    );
  }
}

EmbedLayer.propTypes = {
  url: PropTypes.object.isRequired,

  // Store
  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  toggleTooltip: PropTypes.func,
  setModalOptions: PropTypes.func
};

const mapStateToProps = state => ({
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (...params) => dispatch(toggleTooltip(...params)),
  toggleModal: (...params) => dispatch(toggleModal(...params)),
  setModalOptions: (...params) => dispatch(setModalOptions(...params))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedLayer);
