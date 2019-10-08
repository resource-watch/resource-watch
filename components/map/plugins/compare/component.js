import React, { Fragment, createRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';

// constants
import { MAPSTYLES, DEFAULT_VIEWPORT } from 'components/map/constants';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import MapboxCompare from './mapbox-compare';

// styles
import './styles.scss';

const MapComparison = (props) => {
  const {
    layers,
    mapOptions
  } = props;
  const swiperRef = createRef();
  const [map, setMap] = useState({ left: null, right: null });
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  const [handleViewport] = useDebouncedCallback((_viewport) => {
    setViewport(_viewport);
  }, 250);

  const handleZoom = (zoom) => {
    setViewport({
      zoom,
      // transitionDuration is always set to avoid mixing
      // durations of other actions (like flying)
      transitionDuration: 250
    });
  };

  // const handleViewport = debounce((_viewport) => {
  //   setViewport(_viewport);
  // }, 250);

  const handleMapRefs = (_map) => {
    setMap({
      ...map,
      ..._map
    });
  };

  return (
    <div className="c-map-comparison">
      <div className="compare-container">
        {/* swiper */}
        <div
          ref={swiperRef}
          className="swiper-container mapboxgl-compare"
        >
          <div className="compare-swiper" />
        </div>

        {/* left map */}
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          // onClick={onClickLayer}
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          viewport={viewport}
          className="-compare"
          basemap="dark"
          labels="light"
          boundaries
          // onViewportChange={handleViewport}
          onLoad={({ map: _map }) => handleMapRefs({ left: _map })}
          {...mapOptions}
        >
          {_map => (
            <Fragment>
              <LayerManager
                map={_map}
                layers={[layers[0]]}
              />
            </Fragment>
          )}
        </Map>
      </div>
      <div className="compare-container">
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          // onClick={onClickLayer}
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          viewport={viewport}
          className="-compare"
          basemap="dark"
          labels="light"
          boundaries
          // onViewportChange={handleViewport}
          onLoad={({ map: _map }) => handleMapRefs({ right: _map })}
          {...mapOptions}
        >
          {_map => (
            <Fragment>
              <LayerManager
                map={_map}
                layers={[layers[1]]}
              />
            </Fragment>
          )}
        </Map>
      </div>

      <MapControls>
        <ZoomControls
          viewport={viewport}
          onClick={handleZoom}
        />
      </MapControls>

      {(map.left && map.right) && (
        <MapboxCompare
          leftRef={map.left}
          rightRef={map.right}
          swiper={swiperRef}
          options={{}}
        />)}
    </div>
  );
};

MapComparison.propTypes = {
  mapOptions: PropTypes.object,
  layers: PropTypes.array.isRequired
};

MapComparison.defaultProps = { mapOptions: {} };

export default MapComparison;
