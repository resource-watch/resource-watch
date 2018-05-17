import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import Map from 'components/ui/map/Map';
import { Legend, LegendItemTypes } from 'wri-api-components';

import {
  generateLayerGroups,
  setLayerInteraction,
  setLayerInteractionLatLng
} from 'components/admin/layers/form/layer-preview/layer-preview-actions';

import LayerManager from 'utils/layers/LayerManager';

// Constants
const MAP_CONFIG = {
  zoom: 3,
  latLng: {
    lat: 0,
    lng: 0
  },
  zoomControl: false
};


class LayerPreviewComponent extends PureComponent {
  setLayerInteraction(interaction) {
    this.props.dispatch(setLayerInteraction({ interaction }));
  }

  setLayerInteractionSelected(interactionSelected) {
    this.props.dispatch(setLayerInteraction({ interactionSelected }));
  }


  setLayerInteractionLatLng(interactionLatLng) {
    this.props.dispatch(setLayerInteractionLatLng({ interactionLatLng }));
  }

  handleRefreshPreview() {
    const { form, interactions } = this.props;
    this.props.dispatch(generateLayerGroups({ form, interactions }));
  }

  render() {
    const { adminLayerPreview, interactions } = this.props;

    const {
      layerGroups,
      interaction,
      interactionLatLng,
      interactionSelected
    } = adminLayerPreview;

    const { added } = interactions;

    return (
      <div className="c-field preview-container">
        <h5>Layer preview</h5>
        <div className="map-container">
          <Map
            LayerManager={LayerManager}
            mapConfig={MAP_CONFIG}
            layerGroups={layerGroups}
            availableInteractions={added}
            interaction={interaction}
            interactionSelected={interactionSelected}
            interactionLatLng={interactionLatLng}
            setLayerInteraction={data => this.setLayerInteraction(data)}
            setLayerInteractionSelected={data => this.setLayerInteractionSelected(data)}
            setLayerInteractionLatLng={data => this.setLayerInteractionLatLng(data)}

            setMapInstance={(map) => { this.map = map; }}
          />

          <div className="c-legend-map">
            <Legend
              maxHeight={140}
              layerGroups={layerGroups}
              sortable={false}
              LegendItemTypes={<LegendItemTypes />}
            />
          </div>
        </div>
        <div className="actions">
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

const mapStateToProps = state => ({
  user: state.user,
  adminLayerPreview: state.adminLayerPreview,
  interactions: state.interactions
});

LayerPreviewComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  adminLayerPreview: PropTypes.object.isRequired,
  interactions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(LayerPreviewComponent);
