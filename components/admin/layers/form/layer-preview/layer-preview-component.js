import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import Map from 'components/ui/map/Map';
import Legend from 'components/ui/Legend';

import { setLayerInteraction, setLayerInteractionLatLng, setLayerGroups } from 'components/admin/layers/form/layer-preview/layer-preview-actions';

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
  componentWillMount() {
    const { form } = this.props;
    const layerGroups = [{
      dataset: form.dataset,
      visible: true,
      layers: [{
        active: true,
        application: form.application,
        layerConfig: form.layerConfig,
        interactionConfig: form.interactionConfig,
        legendConfig: form.legendConfig,
        id: form.id,
        name: form.name,
        provider: form.provider,
        slug: form.slug,
        iso: form.iso,
        description: form.description
      }]
    }];
    this.props.dispatch(setLayerGroups({ layerGroups }));
  }

  setLayerInteraction(interaction) {
    this.props.dispatch(setLayerInteraction({ interaction }));
  }

  setLayerInteractionSelected() {

  }

  setLayerInteractionLatLng(interactionLatLng) {
    this.props.dispatch(setLayerInteractionLatLng({ interactionLatLng }));
  }

  render() {
    const { adminLayerPreview } = this.props;
    const { layerGroups, interaction, interactionLatLng } = adminLayerPreview;

    return (
      <div className="c-field preview-container">
        <h5>Layer preview</h5>
        <div className="map-container">
          <Map
            LayerManager={LayerManager}
            mapConfig={MAP_CONFIG}
            layerGroups={layerGroups}
            interaction={interaction}
            interactionLatLng={interactionLatLng}
            setLayerInteraction={layer => this.setLayerInteraction(layer)}
            setLayerInteractionLatLng={latlng => this.setLayerInteractionLatLng(latlng)}
            setMapInstance={(map) => { this.map = map; }}
          />
          {layerGroups.length > 0 &&
            <Legend
              layerGroups={layerGroups}
              className={{ color: '-dark' }}
              toggleLayerGroupVisibility={() => {}}
              setLayerGroupsOrder={() => {}}
              setLayerGroupActiveLayer={() => {}}
              readonly
            />
          }
        </div>
        <div className="actions">
          <button
            type="button"
            className="c-button -primary"
            onClick={this.handleRefreshPreview}
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
  adminLayerPreview: state.adminLayerPreview
});

LayerPreviewComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  adminLayerPreview: PropTypes.object.isRequired
};

LayerPreviewComponent.defaultProps = {

};

export default connect(mapStateToProps, null)(LayerPreviewComponent);
