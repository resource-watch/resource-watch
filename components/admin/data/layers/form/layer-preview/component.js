import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';

// constants
import { MAPSTYLES, BASEMAPS, LABELS } from 'components/map/constants';

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

  render() {
    const {
      adminLayerPreview,
      interactions,
      layers,
      setLayerInteraction,
      setLayerInteractionLatLng
    } = this.props;

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
