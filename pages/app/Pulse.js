import React from 'react';
import { Autobind } from 'es-decorators';

// Helpers
import LayerGlobeManager from 'utils/layers/LayerGlobeManager';

// Components
import Globe from 'components/vis/Globe';
import LayerNav from 'components/app/pulse/LayerNav';
import LayerCard from 'components/app/pulse/LayerCard';

import Spinner from 'components/ui/Spinner';
import ZoomControl from 'components/ui/ZoomControl';
import GlobeTooltip from 'components/app/pulse/GlobeTooltip';
import Page from 'components/app/layout/Page';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getLayers, getLayerPoints } from 'redactions/pulse';
import getLayersGroupPulse from 'selectors/pulse/layersGroupPulse';
import getActiveLayersPulse from 'selectors/pulse/layersActivePulse';
import { toggleTooltip } from 'redactions/tooltip';

const earthImage = 'static/images/components/vis/earth-min.jpg';
const earthBumpImage = 'static/images/components/vis/earth-bump.jpg';
const cloudsImage = 'static/images/components/vis/clouds-min.png';

class Pulse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texture: null,
      loading: false,
      layerPoints: [],
      selectedMarker: null,
      useDefaultLayer: true,
      markerType: 'default'
    };
    this.layerGlobeManager = new LayerGlobeManager();
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentWillMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    this.mounted = true;
    // This is not sending anything, for the moment
    this.props.getLayers();
    document.addEventListener('click', this.triggerMouseDown);
  }

  componentWillReceiveProps(nextProps) {
    const { layerActive } = this.props.pulse;
    const nextLayerActive = nextProps.pulse.layerActive;
    const lastId = (layerActive) ? layerActive.id : null;
    const newId = (nextLayerActive) ? nextLayerActive.id : null;
    if (lastId !== newId) {
      if (nextLayerActive) {
        this.setState({
          loading: true
        });

        if (nextLayerActive.threedimensional === 'true') {
          const datasetId = nextLayerActive.attributes.dataset;
          const options = nextLayerActive.attributes.layerConfig.body.layers[0].options;
          const tableName = options.sql.toUpperCase().split('FROM')[1];
          this.props.getLayerPoints(datasetId, tableName);
        } else {
          this.layerGlobeManager.addLayer(nextLayerActive.attributes, {
            onLayerAddedSuccess: function success(texture) {
              console.info(texture);
              this.setState({
                texture,
                loading: false,
                layerPoints: []
              });
            }.bind(this),
            onLayerAddedError: function error(err) {
              console.error(err);
              this.setState({
                texture: null,
                loading: false,
                layerPoints: []
              });
            }.bind(this)
          });
        }
      } else {
        this.layerGlobeManager.abortRequest();
        this.setState({ texture: null });
      }
    }

    if (nextProps.pulse.layerPoints !== this.props.pulse.layerPoints) {
      if (nextProps.pulse.layerPoints.length > 0) {
        this.setState({
          loading: false,
          layerPoints: nextProps.pulse.layerPoints.slice(0),
          texture: null,
          useDefaultLayer: false,
          markerType: nextLayerActive.markerType
        });
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.triggerMouseDown);
    this.props.toggleTooltip(false);
    this.mounted = false;
  }

  /**
  * UI EVENTS
  * - triggerZoomIn
  * - triggerZoomOut
  * - triggerMouseDown
  * - handleMarkerSelected
  * - handleEarthClicked
  * - handleClickInEmptyRegion
  */
  @Autobind
  triggerZoomIn() {
    this.globe.camera.translateZ(-5);
  }
  @Autobind
  triggerZoomOut() {
    this.globe.camera.translateZ(5);
  }
  @Autobind
  triggerMouseDown() {
    this.props.toggleTooltip(false);
  }
  @Autobind
  handleMarkerSelected(marker, event) {
    const obj = {};
    Object.keys(marker).forEach((key) => {
      if (key !== 'cartodb_id' && key !== 'the_geom' && key !== 'the_geom_webmercator') {
        obj[key] = marker[key];
      }
    });

    if (this.mounted) {
      this.props.toggleTooltip(true, {
        follow: false,
        children: GlobeTooltip,
        childrenProps: { value: obj },
        position: { x: event.clientX, y: event.clientY }
      });
    }
  }
  @Autobind
  handleEarthClicked(latLon, clientX, clientY) {
    this.props.toggleTooltip(false);
    if (this.props.pulse.layerActive) {
      const currentLayer = this.props.pulse.layerActive.attributes;
      const datasetId = currentLayer.dataset;
      const options = currentLayer.layerConfig.body.layers[0].options;
      const geomColumn = options.geom_column;
      const tableName = options.sql.toUpperCase().split('FROM')[1];
      const geoJSON = JSON.stringify({
        type: 'Point',
        coordinates: [latLon.longitude, latLon.latitude]
      });
      let requestURL;
      if (geomColumn) {
        requestURL = `${process.env.WRI_API_URL}/query/${datasetId}?sql=SELECT ST_Value(st_transform(${geomColumn},4326), st_setsrid(st_geomfromgeojson('${geoJSON}'),4326), true) FROM ${tableName} WHERE st_intersects(${geomColumn},st_setsrid(st_geomfromgeojson('${geoJSON}'),4326))`;
      } else {
        requestURL = `${process.env.WRI_API_URL}/query/${datasetId}?sql=SELECT * FROM ${tableName} WHERE st_intersects(the_geom,st_buffer(ST_SetSRID(st_geomfromgeojson('${geoJSON}'),4326),1))`;
      }
      this.setTooltipValue(requestURL, clientX, clientY);
    }
  }
  @Autobind
  handleClickInEmptyRegion() {
    this.props.toggleTooltip(false);
  }

  /**
  * HELPER FUNCTIONS
  * - setTooltipValue
  */
  @Autobind
  setTooltipValue(requestURL, tooltipX, tooltipY) {
    fetch(new Request(requestURL))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }).then((response) => {
        if (response.data.length > 0) {
          const obj = response.data[0];
          delete obj.the_geom;
          delete obj.the_geom_webmercator;
          delete obj.cartodb_id;
          this.props.toggleTooltip(true, {
            follow: false,
            children: GlobeTooltip,
            childrenProps: { value: obj },
            position: { x: tooltipX, y: tooltipY }
          });
        }
      });
  }

  render() {
    const { url, layersGroup } = this.props;
    const layerActive = this.props.pulse.layerActive;
    const { markerType } = this.state;
    const globeWidht = (typeof window === 'undefined') ? 500 : window.innerWidth;
    const globeHeight = (typeof window === 'undefined') ? 300 : window.innerHeight - 130; // TODO: 130 is the header height
    return (
      <Page
        title="Planet Pulse"
        description="Planet Pulse description"
        url={url}
      >
        <div
          className="c-page -dark"
        >
          <LayerNav
            layerActive={layerActive}
            layersGroup={layersGroup}
          />
          <LayerCard
            layerActive={layerActive}
          />
          <Spinner
            isLoading={this.state.loading}
          />
          <Globe
            ref={globe => (this.globe = globe)}
            width={globeWidht}
            height={globeHeight}
            pointLightColor={0xcccccc}
            ambientLightColor={0x444444}
            enableZoom
            lightPosition={'right'}
            texture={this.state.texture}
            layerPoints={this.state.layerPoints}
            markerType={markerType}
            earthImagePath={earthImage}
            earthBumpImagePath={earthBumpImage}
            defaultLayerImagePath={cloudsImage}
            segments={64}
            rings={64}
            useHalo
            useDefaultLayer={this.state.useDefaultLayer}
            onMarkerSelected={this.handleMarkerSelected}
            onEarthClicked={this.handleEarthClicked}
            onClickInEmptyRegion={this.handleClickInEmptyRegion}
          />
          <ZoomControl
            ref={zoomControl => (this.zoomControl = zoomControl)}
            onZoomIn={this.triggerZoomIn}
            onZoomOut={this.triggerZoomOut}
          />
        </div>
      </Page>
    );
  }
}

Pulse.propTypes = {
  // ROUTER
  url: React.PropTypes.object,

  // STORE
  layersGroup: React.PropTypes.array,
  layerActive: React.PropTypes.object,
  getLayers: React.PropTypes.func,
  getLayerPoints: React.PropTypes.func,
  toggleTooltip: React.PropTypes.func
};

const mapStateToProps = state => ({
  pulse: state.pulse,
  layersGroup: getLayersGroupPulse(state),
  layerActive: getActiveLayersPulse(state)
});

const mapDispatchToProps = dispatch => ({
  getLayers: () => {
    dispatch(getLayers());
  },
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  },
  getLayerPoints: (id, tableName) => {
    dispatch(getLayerPoints(id, tableName));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Pulse)
