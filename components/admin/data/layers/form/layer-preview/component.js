import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';
import { useDebouncedCallback } from 'use-debounce';

// constants
import { MAPSTYLES, DEFAULT_VIEWPORT } from 'components/map/constants';

// styles
import './styles.scss';

const LayerPreview = ({ layerGroup }) => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (layerGroup.length) {
      const layer = layerGroup[0].layers || [];
      setLayers(layer);
    }
  }, [layerGroup]);

  const [handleViewport] = useDebouncedCallback((_viewport) => {
    setViewport(_viewport);
  }, 250);

  const handleZoom = (zoom) => {
    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  };

  return (
    <div className="c-layer-preview">
      <div className="map-container">
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          // onClick={this.onClickLayer}
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          viewport={viewport}
          // bounds={bounds}
          basemap="dark"
          labels="light"
          // boundaries={boundaries}
          onViewportChange={handleViewport}
        >
          {_map => (
            <Fragment>
              <LayerManager
                map={_map}
                layers={layers}
              />

              {/* {!isEmpty(layerGroupsInteractionLatLng) && activeLayers.length &&
                <Popup
                  {...layerGroupsInteractionLatLng}
                  closeButton
                  closeOnClick={false}
                  onClose={this.handleClosePopup}
                  className="rw-popup-layer"
                  maxWidth="250px"
                >
                  <LayerPopup
                    data={{
                      // data available in certain point
                      layersInteraction: layerGroupsInteraction,
                      // ID of the layer will display data (defualts into the first layer)
                      layersInteractionSelected: layerGroupsInteractionSelected,
                      // current active layers to get their layerConfig attributes
                      layers: activeLayers
                    }}
                    latlng={{
                      lat: layerGroupsInteractionLatLng.latitude,
                      lng: layerGroupsInteractionLatLng.longitude
                    }}
                    onChangeInteractiveLayer={this.onChangeInteractiveLayer}
                  />
                </Popup>
              } */}
            </Fragment>
          )}
        </Map>

        <MapControls>
          <ZoomControls
            viewport={viewport}
            onClick={handleZoom}
          />
        </MapControls>
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
};

LayerPreview.propTypes = { layerGroup: PropTypes.array };

LayerPreview.defaultProps = { layerGroup: [] };

export default LayerPreview;
