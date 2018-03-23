import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';

// Components
import Map from 'components/ui/map/Map';

import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import PlaceholderChart from 'components/charts/placeholder-chart';

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
  LegendItemButtonOpacity,
  LegendItemButtonVisibility,
  LegendItemButtonInfo,
  LegendItemTypes
} from 'wri-api-components';

class AlertWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      zoom: 3,
      latLng: {
        lat: 0,
        lng: 0
      }
    };
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.setState({ zoom, latLng });
  }, 250);

  render() {
    const { dataset, user } = this.props;

    const widget = dataset.widget.find(w => w.default);
    const layer = dataset.layer.find(l => l.default);

    const isWidgetMap = widget && widget.widgetConfig.type === 'map';
    const layerGroup = user.areas.layerGroups[this.props.layerGroup].map((g) => {
      g.dataset = dataset.id;
      return g;
    });

    const { zoom, latLng } = this.state;

    if (widget && !isWidgetMap) {
      return (
        <div className="c-alerts-page__widget">
          <h3 className="c-alerts-page__widget--heading">{widget.name}</h3>
          <div className="c-alerts-page__graph">
            <WidgetChart widget={widget} mode="fullwidth" />
          </div>
        </div>);
    } else if (layer || isWidgetMap) {
      return (
        <div className="c-alerts-page__widget">
          <h3 className="c-alerts-page__widget--heading">{layer.name}</h3>

          <div className="c-alerts-page__graph">
            <Map
              mapConfig={{ zoom, latLng }}
              LayerManager={LayerManager}
              layerGroups={layerGroup}
              onMapParams={this.onMapParams}
              useLightBasemap
            />

            <MapControls>
              <ShareControl />
              <BasemapControl
                basemap={BASEMAPS.dark}
                labels={LABELS.light}
                boundaries={false}
                onChangeBasemap={this.props.setMapBasemap}
                onChangeLabels={this.props.setMapLabels}
                onChangeBoundaries={this.props.setMapBoundaries}
              />
            </MapControls>

          </div>

        </div>);
    }

    return (
      <Link route="explore_detail" params={{ id: dataset.id }}>
        <a>
          <PlaceholderChart />
        </a>
      </Link>
    );
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
