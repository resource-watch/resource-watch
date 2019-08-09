import React, { PureComponent } from 'react';
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
    customClass: PropTypes.string,

    /** An object that defines the viewport
     * @see https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map?section=initialization
    */
    viewport: PropTypes.shape({}),

    /** An object that defines the bounds */
    bounds: PropTypes.shape({
      bbox: PropTypes.array,
      options: PropTypes.shape({})
    }),

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
    customClass: null,
    viewport: DEFAULT_VIEWPORT,
    bounds: {},
    dragPan: true,
    dragRotate: true,
    scrollZoom: true,
    touchZoom: true,
    touchRotate: true,
    doubleClickZoom: true,

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

  componentDidMount() {
    const { bounds } = this.props;

    if (!isEmpty(bounds) && !!bounds.bbox) {
      this.fitBounds();
    }
  }

  componentDidUpdate(prevProps) {
    const { viewport: prevViewport, bounds: prevBounds } = prevProps;
    const { viewport, bounds } = this.props;
    const { viewport: stateViewport } = this.state;

    if (!isEqual(viewport, prevViewport)) {
      this.setState({ // eslint-disable-line
        viewport: {
          ...stateViewport,
          ...viewport
        }
      });
    }

    if (!isEmpty(bounds) && !isEqual(bounds, prevBounds)) {
      this.fitBounds();
    }
  }

  onLoad = () => {
    const { onLoad } = this.props;
    this.setState({ loaded: true });

    onLoad({
      map: this.map,
      mapContainer: this.mapContainer
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

  fitBounds = () => {
    const { viewport: currentViewport } = this.state;
    const { bounds, onViewportChange } = this.props;
    const { bbox, options } = bounds;

    const viewport = {
      width: this.mapContainer.offsetWidth,
      height: this.mapContainer.offsetHeight,
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
      transitionDuration: 1500,
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
      customClass,
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
        ref={(r) => { this.mapContainer = r; }}
        className={classnames({
          'c-map': true,
          [customClass]: !!customClass
        })}
      >
        <ReactMapGL
          ref={(map) => { this.map = map && map.getMap(); }}

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

          // DEFAULT FUC IMPLEMENTATIONS
          onViewportChange={this.onViewportChange}
          onResize={this.onResize}
          onLoad={this.onLoad}

          transitionInterpolator={new FlyToInterpolator()}
        >
          {loaded && !!this.map && typeof children === 'function' && children(this.map)}
        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
