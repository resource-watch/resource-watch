import { createRef, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Legend, LegendListItem, LegendItemTypes } from 'vizzuality-components';
import { useDebouncedCallback } from 'use-debounce';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES } from 'components/map/constants';

// components
import Map from 'components/map';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import LayerManager from 'components/map/layer-manager';
import MapboxCompare from './mapbox-compare';

const CompareMaps = (props) => {
  const { layers, bbox, compareOptions } = props;
  const swiperRef = createRef();
  const legendRef = useRef();
  const [map, setMap] = useState({ left: null, right: null });
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  const handleViewport = useDebouncedCallback((_viewport) => {
    setViewport(_viewport);
  }, 1);

  const handleZoom = useCallback((zoom) => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      zoom,
      transitionDuration: 250,
    }));
  }, []);

  const handleMapRefs = (_map) => {
    setMap({
      ...map,
      ..._map,
    });
  };

  return (
    <div className="c-map-comparison">
      <div className="compare-container">
        {/* left map */}
        <Map
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          basemap="dark"
          labels="light"
          boundaries
          {...(bbox && {
            bounds: {
              bbox,
              options: {},
            },
          })}
          viewport={viewport}
          onLoad={({ map: _map }) => handleMapRefs({ left: _map })}
        >
          {(_map) => (
            <>
              <LayerManager map={_map} layers={[layers[0]]} />
            </>
          )}
        </Map>

        <div className="legend-container" ref={legendRef}>
          <Legend
            key={layers[0].dataset}
            maxWidth="50%"
            maxHeight={150}
            sortable={false}
            collapsable={false}
            customClass="legend-embed"
          >
            <LegendListItem
              index={0}
              key={layers[0].dataset}
              layerGroup={{
                dataset: layers[0].dataset,
                visible: true,
                opacity: 1,
                layers: [
                  {
                    ...layers[0],
                    active: true,
                  },
                ],
              }}
            >
              <LegendItemTypes />
            </LegendListItem>
          </Legend>
          <Legend
            key={layers[1].dataset}
            maxWidth="50%"
            maxHeight={150}
            sortable={false}
            collapsable={false}
            customClass="legend-embed"
          >
            <LegendListItem
              index={0}
              key={layers[1].dataset}
              layerGroup={{
                dataset: layers[1].dataset,
                visible: true,
                opacity: 1,
                layers: [
                  {
                    ...layers[1],
                    active: true,
                  },
                ],
              }}
            >
              <LegendItemTypes />
            </LegendListItem>
          </Legend>
        </div>
      </div>
      <div className="compare-container">
        {/* right map */}
        {/* swiper */}
        <div ref={swiperRef} className="swiper-container mapboxgl-compare">
          <div className="compare-swiper" />
        </div>
        <Map
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          basemap="dark"
          labels="light"
          boundaries
          onMapViewportChange={handleViewport}
          onLoad={({ map: _map }) => handleMapRefs({ right: _map })}
          viewport={viewport}
        >
          {(_map) => (
            <>
              <LayerManager map={_map} layers={[layers[1]]} />
            </>
          )}
        </Map>
      </div>

      <MapControls customClass="c-map-controls -embed">
        <ZoomControls viewport={viewport} onClick={handleZoom} />
      </MapControls>

      {map.left && map.right && (
        <MapboxCompare
          leftRef={map.left}
          rightRef={map.right}
          swiper={swiperRef}
          options={{
            swiper: {
              offset: legendRef.current ? legendRef.current.getBoundingClientRect().height : 0,
            },
            ...compareOptions,
          }}
        />
      )}
    </div>
  );
};

CompareMaps.defaultProps = {
  compareOptions: {},
  bbox: null,
};

CompareMaps.propTypes = {
  compareOptions: PropTypes.shape({}),
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      dataset: PropTypes.string.isRequired,
    }),
  ).isRequired,
  bbox: PropTypes.arrayOf(PropTypes.number),
};

export default CompareMaps;
