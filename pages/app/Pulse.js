import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getLayers, getLayerPoints, toggleActiveLayer, setSimilarDatasets } from 'redactions/pulse';
import { toggleTooltip } from 'redactions/tooltip';

// Selectors
import getLayersGroupPulse from 'selectors/pulse/layersGroupPulse';
import getActiveLayersPulse from 'selectors/pulse/layersActivePulse';

// Services
import DatasetService from 'services/DatasetService';

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
import Layout from 'components/app/layout/Layout';

const earthImage = '/static/images/components/vis/earth-min.jpg';
const earthBumpImage = '/static/images/components/vis/earth-bump.jpg';
const cloudsImage = '/static/images/components/vis/clouds-min.png';

class Pulse extends Page {
  constructor(props) {
    super(props);
    this.state = {
      texture: null,
      loading: false,
      layerPoints: [],
      selectedMarker: null,
      useDefaultLayer: true,
      markerType: 'default',
      similarDatasetsLoaded: false,
      similarDatasets: []
    };
    this.layerGlobeManager = new LayerGlobeManager();
  }

  /**
   * COMPONENT LIFECYCLE
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    super.componentDidMount();
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
          loading: true,
          interactionConfig: nextLayerActive.attributes.interactionConfig
        });

        if (nextLayerActive.threedimensional === 'true') {
          const url = nextLayerActive.attributes.layerConfig.pulseConfig.url;
          this.props.getLayerPoints(url);
        } else {
          this.layerGlobeManager.addLayer(nextLayerActive.attributes, {
            onLayerAddedSuccess: function success(texture) {
              this.setState({
                texture,
                loading: false,
                layerPoints: []
              });
            }.bind(this),
            onLayerAddedError: function error(err) {
              toastr.error('Error', err);
              this.setState({
                texture: null,
                loading: false,
                layerPoints: []
              });
            }.bind(this)
          });
        }

        // TESTS
        // load similar datasets
        this.getSimilarDatasets(nextLayerActive.attributes.dataset);
      } else {
        this.layerGlobeManager.abortRequest();
        this.setState({ texture: null });
      }
    }

    if (nextProps.pulse.layerPoints !== this.props.pulse.layerPoints) {
      if (nextProps.pulse.layerPoints && nextProps.pulse.layerPoints.length > 0) {
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
    this.props.toggleActiveLayer(null);
    this.mounted = false;
  }

  getSimilarDatasets(datasetID) {
    this.setState({
      similarDatasetsLoaded: false
    });
    this.datasetService = new DatasetService(datasetID, { apiURL: process.env.WRI_API_URL });
    this.datasetService.getSimilarDatasets()
      .then((response) => {
        let counter = 0;
        const similarDatasets = response.map(val => val.dataset).filter(
          () => {
            counter++;
            return counter < 4;
          });

        if (similarDatasets.length > 0) {
          DatasetService.getDatasets(similarDatasets, 'widget,metadata')
            .then((data) => {
              this.setState({
                similarDatasetsLoaded: true
              });
              this.props.setSimilarDatasets(data);
            })
            .catch(err => toastr.error('Error', err));
        } else {
          this.setState({
            similarDatasetsLoaded: true,
            similarDatasets: []
          });
        }
      })
      .catch(err => toastr.error('Error', err));
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

    const tooltipContentObj = this.state.interactionConfig.output.map(elem =>
      ({ key: elem.property, value: obj[elem.column], type: elem.type }));

    if (this.mounted) {
      this.props.toggleTooltip(true, {
        follow: false,
        children: GlobeTooltip,
        childrenProps: { value: tooltipContentObj },
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
        }
        throw new Error(response.statusText);
      }).then((response) => {
        if (response.data.length > 0) {
          const obj = response.data[0];

          const tooltipContentObj = this.state.interactionConfig.output.map(elem =>
            ({ key: elem.property, value: obj[elem.column], type: elem.type }));

          this.props.toggleTooltip(true, {
            follow: false,
            children: GlobeTooltip,
            childrenProps: { value: tooltipContentObj },
            position: { x: tooltipX, y: tooltipY }
          });
        }
      });
  }

  render() {
    const { url, layersGroup } = this.props;
    const layerActive = this.props.pulse.layerActive;
    const { markerType, layerPoints, texture, useDefaultLayer } = this.state;
    const globeWidht = (typeof window === 'undefined') ? 500 : window.innerWidth;
    const globeHeight = (typeof window === 'undefined') ? 300 : window.innerHeight - 75; // TODO: 75 is the header height
    return (
      <Layout
        title="Planet Pulse"
        description="Planet Pulse description"
        url={url}
        user={this.props.user}
      >
        <div
          className="l-map -dark"
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
            texture={texture}
            layerPoints={layerPoints}
            markerType={markerType}
            earthImagePath={earthImage}
            earthBumpImagePath={earthBumpImage}
            defaultLayerImagePath={cloudsImage}
            segments={64}
            rings={64}
            useHalo
            useDefaultLayer={useDefaultLayer}
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
      </Layout>
    );
  }
}

Pulse.propTypes = {
  // ROUTER
  url: PropTypes.object,

  // STORE
  layersGroup: PropTypes.array,
  layerActive: PropTypes.object,
  getLayers: PropTypes.func.isRequired,
  getLayerPoints: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  toggleActiveLayer: PropTypes.func.isRequired,
  setSimilarDatasets: PropTypes.func.isRequired
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
  },
  toggleActiveLayer: (id, threedimensional, markerType) => {
    dispatch(toggleActiveLayer(id, threedimensional, markerType));
  },
  setSimilarDatasets: (similarDatasets) => {
    dispatch(setSimilarDatasets(similarDatasets));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Pulse);
