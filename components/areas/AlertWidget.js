import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';

// Components
import Map from 'components/ui/map/Map';

import MapControls from 'components/ui/map/MapControls';
import ShareControl from 'components/ui/map/controls/ShareControl';
import BasemapControl from 'components/ui/map/controls/BasemapControl';

// Utils
import LayerManager from 'utils/layers/LayerManager';

import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// WRI components
import {
  Legend,
  LegendItemToolbar,
  LegendItemButtonLayers,
  LegendItemButtonInfo,
  LegendItemTypes
} from 'wri-api-components';

class AlertWidget extends React.Component {

  constructor(props) {
    super(props);

    const { dataset, user, subscription } = this.props;

    this.state = {
      zoom: 3,
      latLng: {
        lat: 0,
        lng: 0
      },
      layerGroups: [{
        dataset: dataset.id,
        visible: true,
        layers: dataset.layer.map(d => ({
          active: true,
          id: d.id,
          layerConfig: d.layerConfig,
          provider: d.provider
        }))
      }]
    };
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.setState({ zoom, latLng });
  }, 250);

  render() {
    const { dataset, user, subscription } = this.props;
    const layer = dataset.layer.find(l => l.default);
    const { zoom, latLng } = this.state;
    return (
      <div className="c-alerts-page__widget">
        <h3 className="c-alerts-page__widget--heading">{layer && layer.name ? layer.name : 'not defined'}</h3>
        {layer && <div className="c-alerts-page__graph">
          <Map
            mapConfig={{ zoom, latLng }}
            LayerManager={LayerManager}
            layerGroups={this.state.layerGroups}
            onMapParams={this.onMapParams}
            useLightBasemap
          />
          <MapControls>
            <ShareControl />
            <BasemapControl
              basemap={BASEMAPS.dark}
              labels={LABELS.light}
              boundaries={false}
            />
          </MapControls>

          <div className="c-legend-map">
            <Legend
              maxHeight={300}
              layerGroups={this.state.layerGroups}
              // List item
              LegendItemToolbar={
                <LegendItemToolbar>
                  <LegendItemButtonLayers />
                  <LegendItemButtonInfo />
                </LegendItemToolbar>
              }
              LegendItemTypes={<LegendItemTypes />}
            />
          </div>

        </div>}
    </div>);
  }
}

AlertWidget.propTypes = {
  dataset: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(AlertWidget);
