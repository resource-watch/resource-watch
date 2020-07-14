import React, { Fragment, createRef, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

// constants
import { MAPSTYLES } from 'components/map/constants';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapboxCompare from './mapbox-compare';

// styles
import './styles.scss';

const CompareMaps = (props) => {
  const {
    layers,
    bbox,
    mapOptions,
    compareOptions
  } = props;
  const swiperRef = createRef();
  const legendRef = useRef();
  const [map, setMap] = useState({ left: null, right: null });

  const handleMapRefs = (_map) => {
    setMap({
      ...map,
      ..._map
    });
  };

  return (
    <div className="c-map-comparison">
      <div className="compare-container">
        {/* left map */}
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          className="-compare"
          basemap="dark"
          labels="light"
          boundaries
          {...(bbox && { 
            bounds: {
              bbox,
              options: {}
            }} 
          )}
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

        <div
          className="legend-container"
          ref={legendRef}
        >
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
                layers: [{
                  ...layers[0],
                  active: true
                }]
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
                layers: [{
                  ...layers[1],
                  active: true
                }]
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
        <div
          ref={swiperRef}
          className="swiper-container mapboxgl-compare"
        >
          <div className="compare-swiper" />
        </div>
        <Map
          mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
          interactiveLayerIds={[]}
          mapStyle={MAPSTYLES}
          className="-compare"
          basemap="dark"
          labels="light"
          boundaries
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

      {(map.left && map.right) && (
        <MapboxCompare
          leftRef={map.left}
          rightRef={map.right}
          swiper={swiperRef}
          options={{
            swiper: {
              offset: legendRef.current ?
                legendRef.current.getBoundingClientRect().height : 0
              },
              ...compareOptions
          }}
        />)}
    </div>
  );
};

CompareMaps.propTypes = {
  mapOptions: PropTypes.object,
  compareOptions: PropTypes.object,
  layers: PropTypes.array.isRequired
};

CompareMaps.defaultProps = {
  mapOptions: {},
  compareOptions: {}
};

export default CompareMaps;
