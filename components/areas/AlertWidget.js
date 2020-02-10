import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// Redux
import { connect } from 'react-redux';

// Selectors
import areaAlerts from 'selectors/user/areaAlerts';

// Components
import ShareControls from 'components/map/controls/share';
import BasemapControl from 'components/ui/map/controls/BasemapControl';
import { BASEMAPS, LABELS } from 'components/ui/map/constants';
import DataTable from 'components/ui/DataTable';

// Modal
import Modal from 'components/modal/modal-component';
// import AreaSubscriptionModal from 'components/modal/AreaSubscriptionModal';
import LayerInfoModal from 'components/modal/layer-info-modal';

// Services
import { fetchGeostore } from 'services/geostore';

// Utils
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';

// WRI components
import {
  Map,
  MapControls,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemToolbar,
  LegendItemButtonInfo,
  LegendItemTypes
} from 'vizzuality-components';

class AlertWidget extends React.Component {
  constructor(props) {
    super(props);
    const {
      dataset,
      subscriptionData,
      user,
      id
    } = props;

    const { areas } = user;

    this.state = {
      area: areas.items.find(a => a.id === id),
      alertTable: null,
      subscriptionData,
      modalOpen: false,
      zoom: 0,
      geostore: null,
      layer: null,
      latLng: {
        lat: 0,
        lng: 0
      },
      layerGroups: [{
        dataset: dataset ? dataset.id : null,
        visible: true,
        layers: dataset ? dataset.layer.map((d, k) => ({
          active: k === 0,
          id: d.id,
          name: d.name,
          layerConfig: d.layerConfig,
          legendConfig: d.legendConfig,
          provider: d.provider
        })) : null
      }]
    };
  }

  componentDidMount() {
    const { area, layerGroups } = this.state;

    getGeostore(area.attributes.geostore)
      .then(({ data }) => {
        const geostore = { ...data.attributes, id: data.id, type: data.type };

        this.setState({ geostore });
      });
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if ((nextProps.subscriptionData !== this.state.subscriptionData) && !this.state.alertTable) {
      this.getAlertHistory(nextProps).then(table => this.setState({ alertTable: table }));
    }
  }

  // Map params
  onMapParams = debounce(({ zoom, latLng }) => {
    this.setState({ zoom, latLng });
  }, 250);

  onChangeLayer = (l) => {
    const { layerGroups } = this.state;

    const layers = layerGroups.length && 'layers' in layerGroups[0] ?
      layerGroups[0].layers.map((layer) => {
        layer.active = layer.id === l.id;
        return layer;
      }) : [];

    layerGroups[0] = Object.assign({}, layerGroups[0], layers);
    this.setState({ layerGroups });
  }

  onChangeInfo = (layer) => {
    if (layer) {
      layer = { ...layer, dataset: this.props.dataset.id };
    }

    this.setState({ layer });
  }

  // XXX: this is a temporary fix
  // currently the structure from the alerts return <uid>-<title>
  // This abstracts the two out of the string
  getAlertInfoFromKey(key) {
    return {
      id: key.substr(0, 36),
      title: key.substring(37)
    };
  }

  getAlertHistory(props) {
    const { subscriptionData, dataset } = props;
    const layer = dataset ? dataset.layer.find(l => l.default) : null;

    const o = {
      columns: [],
      data: []
    };

    return new Promise((resolve) => {
      if (subscriptionData && subscriptionData.length) {
        subscriptionData.forEach((sub) => {
          Object.keys(sub).forEach((subKey) => {
            const { id } = this.getAlertInfoFromKey(subKey);
            if (id === layer.dataset && sub[subKey].length) {
              o.columns = Object.keys(sub[subKey][0]);
              sub[subKey].forEach((item, key) => {
                if (key < 11) {
                  o.data.push(Object.values(item));
                }
              });
              resolve(o);
            }
          });
        });
      }
    });
  }

  handleEditSubscription(modalOpen = true) {
    this.setState({ modalOpen });
  }

  render() {
    const { dataset } = this.props;
    const layer = dataset ? dataset.layer.find(l => l.default) : null;
    const { zoom, latLng, layerGroups, alertTable, geostore } = this.state;

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
              onMapParams={this.onMapParams}
              onReady={(map) => { this.map = map; }}
              basemap={{
                url: BASEMAPS.dark.value,
                options: BASEMAPS.dark.options
              }}
              label={{
                url: LABELS.light.value,
                options: LABELS.light.options
              }}
              {...geostore && {
                bounds: {
                  bbox: geostore.bbox,
                  options: { padding: [20, 20] }
                }
              }}
            >
              {map => (
                <React.Fragment>
                  <MapControls
                    customClass="c-map-controls"
                  >
                    <ZoomControl map={map} />

                    <ShareControls />

                    <BasemapControl
                      basemap={BASEMAPS.dark}
                      labels={LABELS.light}
                      boundaries={false}
                    />

                  </MapControls>

                  <LayerManager map={map} plugin={PluginLeaflet}>
                    <React.Fragment>
                      <Layer {...layer} />
                      {geostore &&
                      <Layer
                        id={geostore.id}
                        name="Geojson"
                        provider="leaflet"
                        layerConfig={{
                              type: 'geoJSON',
                              body: geostore.geojson
                            }}
                            // Interaction
                        interactivity
                        events={{
                              mouseover: (e) => {
                                console.info(e);
                              }
                            }}
                      />
                        }
                    </React.Fragment>
                  </LayerManager>

                </React.Fragment>
              )}
            </Map>

            <div className="c-legend-map">
              <Legend
                sortable={false}
                maxHeight={300}
                onChangeOrder={this.onChangeOrder}
              >
                {layerGroups.map((lg, i) => (
                  <LegendListItem
                    index={i}
                    key={lg.dataset}
                    layerGroup={lg}
                    onChangeInfo={this.onChangeInfo}
                    toolbar={
                      <LegendItemToolbar>
                        <LegendItemButtonInfo />
                      </LegendItemToolbar>
                    }
                  >
                    <LegendItemTypes />
                  </LegendListItem>
              ))}
              </Legend>
            </div>
          </div>
        }

        {alertTable ? <DataTable
          title="10 Most Recent Changes"
          table={alertTable}
        /> : <p>There are no alerts for this subscription yet.</p>}

        {this.state.modalOpen &&
          <Modal
            isOpen
            onRequestClose={() => this.handleEditSubscription(false)}
          >
            {/* <AreaSubscriptionModal
              area={this.state.area}
              mode="edit"
              onRequestClose={() => this.handleEditSubscription(false)}
              subscriptionDataset
              subscriptionType
              subscriptionThreshold
            /> */}
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
  subscriptionData: PropTypes.array,
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
