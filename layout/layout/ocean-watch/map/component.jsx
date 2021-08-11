import {
  useState,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/router';
import { useDebouncedCallback } from 'use-debounce';
import { Popup } from 'react-map-gl';
import { Tooltip } from 'vizzuality-components';

// components
import Map from 'components/map';
import ZoomControls from 'components/map/controls/zoom';
import LayerManager from 'components/map/layer-manager';
import TooltipList from 'components/tooltip-list';

// hooks
import {
  useOceanWatchAreas,
} from 'hooks/ocean-watch';

// constants
import {
  MAPSTYLES,
  DEFAULT_VIEWPORT,
} from 'components/map/constants';

// utils
import {
  getInteractiveLayers,
} from 'components/map/utils';

const layers = [
  {
    id: 'ocean-watch-coastal-countries',
    provider: 'cartodb',
    promoteId: 'iso',
    isInteractive: true,
    layerConfig: {
      account: 'wri-rw',
      body: {
        layers: [
          {
            type: 'mapnik',
            options: {
              sql: 'SELECT gid_0 as iso, name_0 as name, coastal, the_geom_webmercator FROM gadm36_0 where coastal is true',
            },
          },
        ],
        vectorLayers: [
          {
            paint: {
              'fill-color': [
                'case',
                [
                  'boolean',
                  [
                    'feature-state',
                    'hover',
                  ],
                  false,
                ],
                '#fab72e',
                '#217098',
              ],
              'fill-opacity': 1,
              'fill-outline-color': '#15527f',
            },
            'source-layer': 'layer0',
            type: 'fill',
          },
        ],
        layerType: 'vector',
      },
    },
    opacity: 1,
  },
  {
    id: 'ocean-watch-non-coastal-countries',
    provider: 'cartodb',
    promoteId: 'iso',
    layerConfig: {
      account: 'wri-rw',
      body: {
        layers: [
          {
            type: 'mapnik',
            options: {
              sql: 'SELECT the_geom_webmercator FROM gadm36_0 where coastal is false',
            },
          },
        ],
        vectorLayers: [
          {
            paint: {
              'fill-color': '#0f4573',
              'fill-opacity': 1,
              'fill-outline-color': '#15527f',
            },
            'source-layer': 'layer0',
            type: 'fill',
          },
        ],
        layerType: 'vector',
      },
    },
    opacity: 1,
  },
];

let hoverState = null;

export default function MapSelection() {
  const [viewport, setViewport] = useState({
    ...DEFAULT_VIEWPORT,
    zoom: 1,
  });
  const [buttonListVisibility, setVisibility] = useState(false);
  const [tooltip, setTooltip] = useState({});
  const mapRef = useRef(null);
  const router = useRouter();
  const interactiveLayers = layers.filter(({ isInteractive }) => isInteractive);
  const interactiveLayersIds = getInteractiveLayers(interactiveLayers);

  const handleViewport = useCallback((_viewport) => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      ..._viewport,
    }));
  }, []);
  const handleZoom = useCallback((zoom) => {
    setViewport((prevViewport) => ({
      ...prevViewport,
      zoom,
      transitionDuration: 250,
    }));
  }, []);

  const handleClickCountry = useCallback((evt) => {
    if (!evt.features?.length) return false;

    const {
      properties: {
        iso,
      },
    } = evt.features[0];

    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso,
      },
    });

    return true;
  }, [router]);

  const handleVisibility = useCallback((_visible) => {
    setVisibility(_visible);
  }, []);

  const [handleHover] = useDebouncedCallback((evt) => {
    if (mapRef.current === null) return false;

    if (hoverState) {
      mapRef.current.setFeatureState(
        hoverState,
        {
          hover: false,
        },
      );

      setTooltip({});
    }

    if (evt.features.length > 0) {
      const {
        source,
        sourceLayer,
        properties,
      } = evt.features[0];

      hoverState = {
        source,
        sourceLayer,
        id: properties.iso,
      };

      if (properties.iso) {
        mapRef.current.setFeatureState(
          hoverState,
          {
            hover: true,
          },
        );
      }

      setTooltip({
        lngLat: evt.lngLat,
        countryName: evt.features[0].properties.name,
      });
    }
    return true;
  }, 0);

  const handleCountryList = useCallback(({ value }) => {
    router.push({
      pathname: '/dashboards/ocean-watch/country/[iso]',
      query: {
        iso: value,
      },
    });

    setVisibility(false);
  }, [router]);

  const {
    data: areas,
  } = useOceanWatchAreas({
    placeholderData: [],
    select: (_areas) => _areas.map(({ name, iso }) => ({
      label: name,
      value: iso,
    })),
  });

  return (
    <div
      style={{
        padding: '25px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: '#fff',
          }}
        >
          Where?
        </h3>
        <p
          style={{
            fontSize: 26,
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.4,
          }}
        >
          Select a country lorem ipsum dolor sit,
          <br />
          amet consectetur adipisicing elit.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          height: 475,
          margin: '25px 0 0',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
            boxShadow: 'inset 0 -25px 50px 105px #0f4573',
            pointerEvents: 'none',
          }}
          />
          <Map
            mapStyle={MAPSTYLES}
            viewport={viewport}
            interactiveLayerIds={interactiveLayersIds}
            fitBoundsOptions={{ transitionDuration: 0 }}
            touchZoom={false}
            dragRotate={false}
            onClick={handleClickCountry}
            mapOptions={{
              renderWorldCopies: false,
            }}
            onViewportChange={handleViewport}
            onHover={handleHover}
            onLoad={({ map }) => {
              mapRef.current = map;
            }}
          >
            {(_map) => (
              <>
                <LayerManager
                  map={_map}
                  layers={layers}
                />
                {tooltip.lngLat && (
                  <Popup
                    latitude={tooltip.lngLat[1]}
                    longitude={tooltip.lngLat[0]}
                    closeButton={false}
                    className="rw-ow-popup-layer"
                    captureScroll
                    capturePointerMove
                  >
                    <span
                      style={{
                        color: '#fab72e',
                        textShadow: '1px 1px 2px rgba(15, 69, 115, 0.75)',
                      }}
                    >
                      {tooltip.countryName}
                    </span>
                  </Popup>
                )}
              </>
            )}
          </Map>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <Tooltip
            overlay={(
              <TooltipList
                list={areas}
                onClickItem={handleCountryList}
                placeholder="Type a country..."
              />
            )}
            overlayClassName="c-rc-tooltip -default"
            placement="top"
            trigger="click"
            visible={buttonListVisibility}
            onVisibleChange={handleVisibility}
            destroyTooltipOnHide
          >
            <button
              type="button"
              className="c-btn -secondary -alt"
              style={{
                pointerEvents: 'all',
              }}
              onClick={() => { setVisibility(true); }}
            >
              Select a country
            </button>
          </Tooltip>
        </div>
        <ZoomControls
          viewport={viewport}
          onClick={handleZoom}
        />
      </div>
    </div>
  );
}
