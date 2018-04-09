import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';

// Selectors
import areaAlerts from 'selectors/user/areaAlerts';

// Components
import Map from 'components/ui/map/Map';

import DataTable from 'components/ui/DataTable';
import MapControls from 'components/ui/map/MapControls';
import ShareControl from 'components/ui/map/controls/ShareControl';
import BasemapControl from 'components/ui/map/controls/BasemapControl';

// Modal
import Modal from 'components/modal/modal-component';
import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';
import LayerInfoModal from 'components/modal/layer-info-modal';

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

// TODO:
// For now, we are faking this data
// Fetch real data when we have it :)
const fakeRecentChangesData = {
  columns: ['Latitude', 'Longitude', 'Date & Time', 'FRP'],
  data: [
    [38.3131, -5.5552, '2017-11-07 02.42', 'xxx'],
    [32.3131, -5.5552, '2017-11-07 02.42', 'xxx'],
    [64.3231, -5.5552, '2017-11-07 02.42', 'xxx'],
    [66.5631, -4.2552, '2017-11-07 02.42', 'xxx'],
    [38.3131, -5.5552, '2017-11-07 02.42', 'xxx'],
    [44.3131, -1.2552, '2017-11-07 02.42', 'xxx'],
    [38.3131, -44.552, '2017-11-07 02.42', 'xxx'],
    [55.3131, -12.552, '2017-11-07 02.42', 'xxx'],
    [11.3131, -5.5552, '2017-11-07 02.42', 'xxx'],
    [66.3131, -3.5552, '2017-11-07 02.42', 'xxx']
  ]
};

class AlertWidget extends React.Component {
  constructor(props) {
    super(props);
    const {
      dataset,
      subscription,
      user,
      id
    } = props;
    const { areas } = user;

    this.state = {
      area: areas.items.find(a => a.id === id),
      subscription,
      modalOpen: false,
      zoom: 3,
      layer: null,
      latLng: {
        lat: 0,
        lng: 0
      },
      layerGroups: [{
        dataset: dataset.id,
        visible: true,
        layers: dataset.layer.map((d, k) => ({
          active: k === 0,
          id: d.id,
          name: d.name,
          layerConfig: d.layerConfig,
          legendConfig: d.legendConfig,
          provider: d.provider
        }))
      }]
    };
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.setState({ zoom, latLng });
  }, 250);

  onChangeLayer = (l) => {
    const { layerGroups } = this.state;

    const layers = layerGroups[0].layers.map((layer) => {
      layer.active = layer.id === l.id;
      return layer;
    });

    layerGroups[0] = Object.assign({}, layerGroups[0], layers);
    this.setState({ layerGroups });
  }

  onChangeInfo = (layer) => {
    if (layer) {
      layer = { ...layer, dataset: this.props.dataset.id };
    }

    this.setState({ layer });
  }

  handleEditSubscription(modalOpen = true) {
    this.setState({
      modalOpen
    });
  }

  render() {
    const { dataset } = this.props;
    const layer = dataset.layer.find(l => l.default);
    const { zoom, latLng, layerGroups } = this.state;

    return (
      <div className="c-alerts-page__widget">
        <div className="c-alerts-page__widget--header">
          <h2 className="c-alerts-page__widget--heading">{layer && layer.name ? layer.name : 'not defined'}</h2>
          <button
            className="c-btn -b"
            onClick={() => this.handleEditSubscription(true)}
          >
            Edit Subscriptions
          </button>
        </div>

        {layer &&
        <div className="c-alerts-page__graph">
          <Map
            mapConfig={{ zoom, latLng }}
            LayerManager={LayerManager}
            layerGroups={layerGroups}
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
              maxHeight={250}
              sortable={false}
              layerGroups={layerGroups}
              // List item
              LegendItemToolbar={
                <LegendItemToolbar>
                  <LegendItemButtonLayers />
                  <LegendItemButtonInfo />
                </LegendItemToolbar>
              }
              LegendItemTypes={<LegendItemTypes />}
              onChangeLayer={l => this.onChangeLayer(l)}
              onChangeInfo={this.onChangeInfo}
            />
          </div>
        </div>}

        {/*
        Enabe data table when we got data :)
        <DataTable
          title="10 Most Recent Changes (fake data)"
          table={fakeRecentChangesData}
        />
        */}

        {this.state.modalOpen &&
          <Modal
            isOpen
            onRequestClose={() => this.handleEditSubscription(false)}
          >
            <AreaSubscriptionModal
              area={this.state.area}
              mode="edit"
              onRequestClose={() => this.handleEditSubscription(false)}
              subscriptionDataset
              subscriptionType
              subscriptionThreshold
            />
          </Modal>}

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

      </div>);
  }
}

AlertWidget.propTypes = {
  dataset: PropTypes.object,
  subscription: PropTypes.object,
  user: PropTypes.object,
  id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale,
  alerts: areaAlerts(state)
});

export default connect(mapStateToProps, null)(AlertWidget);
