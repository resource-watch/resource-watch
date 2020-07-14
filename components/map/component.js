import React, { PureComponent, createRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ReactMapGL, { FlyToInterpolator, TRANSITION_EVENTS } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import isEqual from 'react-fast-compare';
import isEmpty from 'lodash/isEmpty';

// constants
import { DEFAULT_VIEWPORT } from './constants';

// styles
import './styles.scss';

class Map extends PureComponent {
  static propTypes = {
    /** A function that returns the map instance */
    children: PropTypes.func,

    /** Custom CSS class for styling */
    className: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
    */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({})
    }),

    /** An object that defines how fitting bounds behaves */
    fitBoundsOptions: PropTypes.object,

    /** A string that defines the basemap to display */
    basemap: PropTypes.string.isRequired,

    /** A string that defines the type of label to display */
    labels: PropTypes.string,

    /** A string that defines if boundaries should be displayed */
    boundaries: PropTypes.bool,

    /** A boolean that allows panning */
    dragPan: PropTypes.bool,

    /** A boolean that allows rotating */
    dragRotate: PropTypes.bool,

    /** A boolean that allows zooming */
    scrollZoom: PropTypes.bool,

    /** A boolean that allows zooming */
    touchZoom: PropTypes.bool,

    /** A boolean that allows touch rotating */
    touchRotate: PropTypes.bool,

    /** A boolean that allows double click zooming */
    doubleClickZoom: PropTypes.bool,

    /** A function that exposes when the map is loaded.
     * It returns and object with the `this.map` and `this.mapContainer`
     * reference. */
    onLoad: PropTypes.func,

    /** A function that exposes the viewport */
    onViewportChange: PropTypes.func,

    /** A function that exposes the viewport */
    getCursor: PropTypes.func
  }

  static defaultProps = {
    children: null,
    className: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    labels: null,
    boundaries: false,
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    doubleClickZoom: true,
    fitBoundsOptions: { transitionDuration: 1500 },

    onViewportChange: () => {},
    onLoad: () => {},
    getCursor: ({ isHovering, isDragging }) => {
      if (isHovering) return 'pointer';
      if (isDragging) return 'grabbing';
      return 'grab';
    }
  }

  state = {
    viewport: {
      ...DEFAULT_VIEWPORT,
      ...this.props.viewport
    },
    flying: false,
    loaded: false
  }

  componentDidUpdate(prevProps) {
    const {
      viewport: prevViewport,
      bounds: prevBounds,
      basemap: prevBasemap,
      labels: prevLabels,
      boundaries: prevBoundaries
    } = prevProps;
    const {
      viewport,
      bounds,
      labels,
      basemap,
      boundaries
    } = this.props;
    const { viewport: stateViewport } = this.state;
    const basemapChanged = prevBasemap !== basemap;
    const labelsChanged = prevLabels !== labels;
    const boundariesChanged = prevBoundaries !== boundaries;
    const boundsChanged = !isEqual(bounds, prevBounds);

    if (!isEqual(viewport, prevViewport)) {
      this.setState({ // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport
        }
      });
    }

    if (basemapChanged) this.setBasemap();
    if (labelsChanged) this.setLabels();
    if (boundariesChanged) this.setBoundaries();
    if (!isEmpty(bounds) && boundsChanged) this.fitBounds();
  }

  onLoad = () => {
    const { onLoad, bounds } = this.props;
    this.setState({ loaded: true });

    this.setBasemap();
    this.setLabels();
    this.setBoundaries();

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds(0);
    }

    onLoad({
      map: this.map.current.getMap(),
      mapContainer: this.mapContainer.current
    });
  }

  onViewportChange = (_viewport) => {
    const { onViewportChange } = this.props;

    this.setState({ viewport: _viewport },
      () => { onViewportChange(_viewport); });
  }

  onResize = (_viewport) => {
    const { onViewportChange } = this.props;
    const { viewport } = this.state;
    const newViewport = {
      ...viewport,
      ..._viewport
    };

    this.setState({ viewport: newViewport });
    onViewportChange(newViewport);
  }

  setBasemap = () => {
    const { basemap } = this.props;
    const BASEMAP_GROUPS = ['basemap'];
    const { layers, metadata } = this.map.current.getMap().getStyle();

    const basemapGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const matchedGroups = BASEMAP_GROUPS.map(rgr => name.toLowerCase().includes(rgr));

      return matchedGroups.some(bool => bool);
    });

    const basemapsWithMeta = basemapGroups.map(_groupId => ({
      ...metadata['mapbox:groups'][_groupId],
      id: _groupId
    }));
    const basemapToDisplay = basemapsWithMeta.find(_basemap => _basemap.name.includes(basemap));

    const basemapLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return basemapGroups.includes(gr);
    });

    if (!basemapToDisplay) return false;

    basemapLayers.forEach((_layer) => {
      const match = _layer.metadata['mapbox:group'] === basemapToDisplay.id;
      if (!match) {
        this.map.current.getMap().setLayoutProperty(_layer.id, 'visibility', 'none');
      } else {
        this.map.current.getMap().setLayoutProperty(_layer.id, 'visibility', 'visible');
      }
    });

    return true;
  }

  setLabels = () => {
    const { labels } = this.props;

    const LABELS_GROUP = ['labels'];
    const { layers, metadata } = this.map.current.getMap().getStyle();

    const labelGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const matchedGroups = LABELS_GROUP.filter(rgr => name.toLowerCase().includes(rgr));

      return matchedGroups.some(bool => bool);
    });

    const labelsWithMeta = labelGroups.map(_groupId => ({
      ...metadata['mapbox:groups'][_groupId],
      id: _groupId
    }));
    const labelsToDisplay = labelsWithMeta.find(_basemap => _basemap.name.includes(labels)) || {};

    const labelLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return labelGroups.includes(gr);
    });

    labelLayers.forEach((_layer) => {
      const match = _layer.metadata['mapbox:group'] === labelsToDisplay.id;
      this.map.current.getMap().setLayoutProperty(_layer.id, 'visibility', match ? 'visible' : 'none');
    });

    return true;
  }

  setBoundaries = () => {
    const { boundaries } = this.props;
    const LABELS_GROUP = ['boundaries'];
    const { layers, metadata } = this.map.current.getMap().getStyle();

    const boundariesGroups = Object.keys(metadata['mapbox:groups']).filter((k) => {
      const { name } = metadata['mapbox:groups'][k];

      const labelsGroup = LABELS_GROUP.map(rgr => name.toLowerCase().includes(rgr));

      return labelsGroup.some(bool => bool);
    });

    const boundariesLayers = layers.filter((l) => {
      const { metadata: layerMetadata } = l;
      if (!layerMetadata) return false;

      const gr = layerMetadata['mapbox:group'];
      return boundariesGroups.includes(gr);
    });

    boundariesLayers.forEach((l) => {
      this.map.current.getMap().setLayoutProperty(l.id, 'visibility', boundaries ? 'visible' : 'none');
    });
  }

  map = createRef();

  mapContainer = createRef();

  fitBounds = () => {
    const { viewport: currentViewport } = this.state;
    const { bounds, onViewportChange, fitBoundsOptions } = this.props;
    const { bbox, options } = bounds;

    const viewport = {
      width: this.mapContainer.current.offsetWidth,
      height: this.mapContainer.current.offsetHeight,
      ...currentViewport
    };

    const { longitude, latitude, zoom } = new WebMercatorViewport(viewport).fitBounds(
      [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
      options
    );    

    const newViewport = {
      ...currentViewport,
      longitude,
      latitude,
      zoom,
      ...fitBoundsOptions,
      transitionInterruption: TRANSITION_EVENTS.UPDATE
    };

    this.setState({
      flying: true,
      viewport: newViewport
    });
    onViewportChange(newViewport);

    setTimeout(() => {
      this.setState({ flying: false });
    }, 1500);
  };

  render() {
    const {
      className,
      children,
      getCursor,
      dragPan,
      dragRotate,
      scrollZoom,
      touchZoom,
      touchRotate,
      doubleClickZoom,
      disableEventsOnFly,
      ...mapboxProps
    } = this.props;
    const { viewport, flying, loaded } = this.state;

    return (
      <div
        ref={this.mapContainer}
        className={classnames({
          'c-map': true,
          [className]: !!className
        })}
      >
        <ReactMapGL
          ref={this.map}

          // CUSTOM PROPS FROM REACT MAPBOX API
          {...mapboxProps}

          // VIEWPORT
          {...viewport}
          width="100%"
          height="100%"

          // INTERACTIVE
          dragPan={!flying && dragPan}
          dragRotate={!flying && dragRotate}
          scrollZoom={!flying && scrollZoom}
          touchZoom={!flying && touchZoom}
          touchRotate={!flying && touchRotate}
          doubleClickZoom={!flying && doubleClickZoom}
          getCursor={getCursor}

          // DEFAULT FUC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}

          transitionInterpolator={new FlyToInterpolator()}
        >
          {loaded && !!this.map && typeof children === 'function' && children(this.map.current.getMap())}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
