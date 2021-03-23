import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';
import isEmpty from 'lodash/isEmpty';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import LayerPopup from 'components/map/popup';

// constants
import { MAPSTYLES, BASEMAPS, LABELS, DEFAULT_VIEWPORT } from 'components/map/constants';

class LayerPreviewComponent extends PureComponent {
  static propTypes = {
    adminLayerPreview: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired,
    interactions: PropTypes.array.isRequired,
    setLayerInteraction: PropTypes.func.isRequired,
    setLayerInteractionLatLng: PropTypes.func.isRequired,
    setLayerInteractionSelected: PropTypes.func.isRequired,
    generateLayerGroups: PropTypes.func.isRequired
  };

  state = { viewport: DEFAULT_VIEWPORT };

  UNSAFE_componentWillMount() {
    this.handleRefreshPreview();
  }

  componentDidUpdate(prevProps) {
    const { interactions } = this.props;
    const { interactions: prevInteractions } = prevProps;
    const interactionesChanged = !isEqual(interactions, prevInteractions);

    if (interactionesChanged) this.handleRefreshPreview();
  }

  onClickLayer = ({ features, lngLat: [longitude, latitude] }) => {
    const {
      adminLayerPreview: { interaction },
      setLayerInteraction,
      setLayerInteractionLatLng
    } = this.props;

    const interactions = this.getInteractions({ features, interaction });
    const lngLatObject = { longitude, latitude };

    setLayerInteractionLatLng(lngLatObject);
    setLayerInteraction(interactions);

    return true;
  }

  getInteractions = ({ features, interaction }) => {
    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message

    const noDataAvailable = !features.length;

    if (noDataAvailable) {
      return Object.keys(interaction).reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: {}
      }), {});
    }

    return features.reduce((accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.layer.source]: { data: currentValue.properties }
    }), {});
  }

  handleViewport = debounce((viewport) => {
    this.setState({ viewport });
  }, 250)

  handleZoom = (zoom) => {
    const { viewport: currentViewport } = this.state;

    this.setState({
      viewport: {
        ...currentViewport,
        zoom
      }
    });
  }

  handleRefreshPreview = () => {
    const { layer, interactions, generateLayerGroups } = this.props;

    generateLayerGroups({ layer, interactions });
  }

  handleClosePopup = () => {
    this.props.setLayerInteractionLatLng(null);
  }

  render() {
    const {
      adminLayerPreview,
      layers,
      setLayerInteractionSelected
    } = this.props;

    const { viewport } = this.state;

    const {
      layerGroups,
      interaction,
      interactionLatLng,
      interactionSelected
    } = adminLayerPreview;

    const shouldRenderPopup = !isEmpty(interactionLatLng) && layers.length;

    const layerPopupData = {
      // data available in certain point
      layersInteraction: interaction,
      // ID of the layer will display data (defualts into the first layer)
      layersInteractionSelected: interactionSelected,
      // current active layers to get their layerConfig attributes
      layers
    };

    const layerPopupLatlng = interactionLatLng && {
      lat: interactionLatLng.latitude,
      lng: interactionLatLng.longitude
    };

    return (
      <div className="c-field preview-container">
        <h5>Layer preview</h5>
        <div className="map-container">
          <div className="c-map">
            <Map
              mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
              onClick={this.onClickLayer}
              mapStyle={MAPSTYLES}
              basemap={BASEMAPS.dark.value}
              labels={LABELS.light.value}
              viewport={viewport}
              onViewportChange={this.handleViewport}
              scrollZoom={false}
              boundaries
            >
              {_map => (
                <Fragment>
                  <LayerManager
                    map={_map}
                    layers={layers}
                  />

                  {shouldRenderPopup &&
                    <Popup
                      {...interactionLatLng}
                      closeButton
                      closeOnClick={false}
                      onClose={this.handleClosePopup}
                      className="rw-popup-layer"
                      maxWidth="250px"
                    >
                      <LayerPopup
                        data={layerPopupData}
                        latlng={layerPopupLatlng}
                        onChangeInteractiveLayer={setLayerInteractionSelected}
                      />
                    </Popup>
                    }
                </Fragment>
              )}
            </Map>
          </div>

          <MapControls>
            <ZoomControls
              viewport={viewport}
              onClick={this.handleZoom}
            />
          </MapControls>

          <div className="c-legend-map">
            <Legend
              maxHeight={140}
              sortable={false}
            >
              {layerGroups.map((lg, i) => (
                <LegendListItem
                  index={i}
                  key={lg.dataset}
                  layerGroup={lg}
                >
                  <LegendItemTypes />
                </LegendListItem>
              ))}
            </Legend>
          </div>
        </div>
        <div className="c-button-container -j-end layer-preview-actions">
          <button
            type="button"
            className="c-button -primary"
            onClick={() => this.handleRefreshPreview()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

export default LayerPreviewComponent;
