import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import classnames from 'classnames';

// Utils
import { logEvent } from 'utils/analytics';

// Components
import Map from 'components/ui/map/Map';
import MapControls from 'components/ui/map/MapControls';
import BasemapControl from 'components/ui/map/controls/BasemapControl';
import ShareControl from 'components/ui/map/controls/ShareControl';

import { Legend, LegendItemToolbar, LegendItemTypes } from 'wri-api-components';

// Utils
import LayerManager from 'utils/layers/LayerManager';

class ExploreMapComponent extends React.Component {
  static propTypes = {
    zoom: PropTypes.number,
    latLng: PropTypes.object,
    layers: PropTypes.array,

    // Actions
    setMapZoom: PropTypes.func,
    setMapLatLng: PropTypes.func
  };

  // Map params
  setMapParams = debounce(({ zoom, latLng }) => {
    this.props.setMapZoom(zoom);
    this.props.setMapLatLng(latLng);
  }, 1000)

  render() {
    const { zoom, latLng, layers } = this.props;

    return (
      <div className="l-map">
        <Map
          mapConfig={{ zoom, latLng }}
          setMapParams={this.setMapParams}
          setMapInstance={(map) => { this.map = map; }}
          disableScrollZoom={false}
          // layerManager
          layerGroups={layers.list}
          LayerManager={LayerManager}
          // // Interaction
          // interaction={interaction}
          // interactionLatLng={interactionLatLng}
          // interactionSelected={interactionSelected}
          // setLayerInteraction={this.props.setLayerInteraction}
          // setLayerInteractionSelected={this.props.setLayerInteractionSelected}
          // setLayerInteractionLatLng={this.props.setLayerInteractionLatLng}
          // resetLayerInteraction={this.props.resetLayerInteraction}
        />

        <MapControls>
          <ShareControl />
          <BasemapControl />
        </MapControls>

        <Legend
          maxWidth={300}
          maxHeight={300}
          layerGroups={layers.list}
          // Item
          LegendItemToolbar={<LegendItemToolbar />}
          LegendItemTypes={<LegendItemTypes />}
          // Actions
          onChangeInfo={this.onChangeInfo}
          onChangeOpacity={this.onChangeOpacity}
          onChangeVisibility={this.onChangeVisibility}
          onChangeLayer={this.onChangeLayer}
          onChangeOrder={this.onChangeOrder}
          onRemoveLayer={this.onRemoveLayer}
        />
      </div>
    );
  }
}

export default ExploreMapComponent;
