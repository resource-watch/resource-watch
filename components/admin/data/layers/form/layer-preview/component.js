import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import isEqual from 'react-fast-compare';
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

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES, BASEMAPS, LABELS } from 'components/map/constants';

class LayerPreviewComponent extends PureComponent {
  static propTypes = {
    adminLayerPreview: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    interactions: PropTypes.array.isRequired,
    setLayerInteraction: PropTypes.func.isRequired,
    setLayerInteractionLatLng: PropTypes.func.isRequired,
    setLayerInteractionSelected: PropTypes.func.isRequired,
    generateLayerGroups: PropTypes.func.isRequired
  };

  state = { viewport: DEFAULT_VIEWPORT };

  componentWillMount() {
    this.handleRefreshPreview();
  }

  componentDidUpdate(prevProps) {
    const { interactions } = this.props;
    const { interactions: prevInteractions } = prevProps;
    const interactionesChanged = !isEqual(interactions, prevInteractions);

    if (interactionesChanged) this.handleRefreshPreview();
  }

  handleRefreshPreview() {
    const { layer, interactions, generateLayerGroups } = this.props;

    generateLayerGroups({ layer, interactions });
  }

  handleZoom = (zoom) => {
    const { viewport: currentViewport } = this.state;

    this.setState({
      viewport: {
        ...currentViewport,
        zoom
      }
    });
  }

  handleViewport = debounce((viewport) => {
    this.setState({ viewport });
  }, 250)

  render() {
    const {
      adminLayerPreview,
      interactions,
      layers,
      setLayerInteraction,
      setLayerInteractionLatLng
    } = this.props;

    const { viewport } = this.state;

    const {
      layerGroups,
      interaction,
      interactionLatLng,
      interactionSelected
    } = adminLayerPreview;

    return (
      <div className="c-field preview-container">
        <h5>Layer preview</h5>
        <div className="map-container">
          <div className="c-map">
            <Map
              mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
              mapStyle={MAPSTYLES}
              basemap={BASEMAPS.dark.value}
              labels={LABELS.light.value}
              viewport={viewport}
              onViewportChange={this.handleViewport}
              boundaries
            >
              {_map => (
                <Fragment>
                  <LayerManager
                    map={_map}
                    layers={layers}
                  />
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
