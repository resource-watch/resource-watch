import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Components
import Map from 'components/ui/map/Map';
import MapControls from 'components/ui/map/MapControls';
import BasemapControl from 'components/ui/map/controls/BasemapControl';
import ShareControl from 'components/ui/map/controls/ShareControl';
import SearchControl from 'components/ui/map/controls/SearchControl';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// WRI components
import {
  Legend,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemTypes
} from 'wri-api-components';

// Modal
import Modal from 'components/modal/modal-component';
import LayerInfoModal from 'components/modal/layer-info-modal';

// Utils
import LayerManager from 'utils/layers/LayerManager';

class ExploreMapComponent extends React.Component {
  static propTypes = {
    embed: PropTypes.bool,

    zoom: PropTypes.number,
    latLng: PropTypes.object,
    basemap: PropTypes.object,
    labels: PropTypes.object,
    boundaries: PropTypes.bool,
    layerGroups: PropTypes.array,
    layerGroupsInteraction: PropTypes.object,
    layerGroupsInteractionSelected: PropTypes.string,
    layerGroupsInteractionLatLng: PropTypes.object,

    // Actions
    setMapZoom: PropTypes.func,
    setMapLatLng: PropTypes.func,
    setMapBasemap: PropTypes.func,
    setMapLabels: PropTypes.func,
    setMapBoundaries: PropTypes.func,

    toggleMapLayerGroup: PropTypes.func,
    setMapLayerGroupVisibility: PropTypes.func,
    setMapLayerGroupOpacity: PropTypes.func,
    setMapLayerGroupActive: PropTypes.func,
    setMapLayerGroupsOrder: PropTypes.func,

    setMapLayerGroupsInteraction: PropTypes.func,
    setMapLayerGroupsInteractionLatLng: PropTypes.func,
    setMapLayerGroupsInteractionSelected: PropTypes.func,
    resetMapLayerGroupsInteraction: PropTypes.func
  };

  state = {
    layer: null
  }

  onChangeInfo = (layer) => {
    this.setState({ layer });
  }

  onChangeOpacity = debounce((l, opacity) => {
    this.props.setMapLayerGroupOpacity({ dataset: { id: l.dataset }, opacity });
  }, 250)

  onChangeVisibility = (l, visibility) => {
    this.props.setMapLayerGroupVisibility({ dataset: { id: l.dataset }, visibility });
  }

  onChangeLayer = (l) => {
    this.props.setMapLayerGroupActive({ dataset: { id: l.dataset }, active: l.id });
  }

  onRemoveLayer = (l) => {
    this.props.toggleMapLayerGroup({ dataset: { id: l.dataset }, toggle: false });
  }

  onChangeOrder = (datasetIds) => {
    this.props.setMapLayerGroupsOrder({ datasetIds });
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.props.setMapZoom(zoom);
    this.props.setMapLatLng(latLng);
  }, 250)

  render() {
    const {
      embed,
      zoom,
      latLng,
      basemap,
      labels,
      boundaries,
      layerGroups,
      layerGroupsInteraction,
      layerGroupsInteractionSelected,
      layerGroupsInteractionLatLng
    } = this.props;

    return (
      <div className="l-map -relative">
        <Map
          mapConfig={{ zoom, latLng }}
          disableScrollZoom={false}

          // layerManager
          layerGroups={layerGroups}
          LayerManager={LayerManager}

          // Interaction
          interaction={layerGroupsInteraction}
          interactionLatLng={layerGroupsInteractionLatLng}
          interactionSelected={layerGroupsInteractionSelected}
          setLayerInteraction={this.props.setMapLayerGroupsInteraction}
          setLayerInteractionSelected={this.props.setMapLayerGroupsInteractionSelected}
          setLayerInteractionLatLng={this.props.setMapLayerGroupsInteractionLatLng}
          resetLayerInteraction={this.props.resetMapLayerGroupsInteraction}
          onMapParams={this.onMapParams}
        />

        <MapControls>
          {!embed &&
            <ShareControl />
          }

          <BasemapControl
            basemap={basemap}
            labels={labels}
            boundaries={boundaries}
            onChangeBasemap={this.props.setMapBasemap}
            onChangeLabels={this.props.setMapLabels}
            onChangeBoundaries={this.props.setMapBoundaries}
          />
          <SearchControl />
        </MapControls>

        <div className="c-legend-map">
          <Legend
            maxHeight={embed ? 100 : 300}
            layerGroups={layerGroups}
            // List item
            LegendItemToolbar={
              (embed) ?
                <LegendItemToolbar>
                  <LegendItemButtonLayers />
                  <LegendItemButtonOpacity />
                  <LegendItemButtonVisibility />
                  <LegendItemButtonInfo />
                </LegendItemToolbar> :

                <LegendItemToolbar />
            }
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

        {!!this.state.layer &&
          <Modal
            isOpen={!!this.state.layer}
            className="-medium"
            onRequestClose={() => this.onChangeInfo(null)}
          >
            <LayerInfoModal
              layer={this.state.layer}
            />
          </Modal>
        }
      </div>
    );
  }
}

export default ExploreMapComponent;
