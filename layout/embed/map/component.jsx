import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { useDebouncedCallback } from 'use-debounce';
import { useRouter } from 'next/router';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemTypes,
} from 'vizzuality-components';
import Link from 'next/link';
import { CancelToken } from 'axios';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import ResetViewControls from 'components/map/controls/reset-view';
import LayerPopup from 'components/map/popup';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/icon';

// hooks
import useIsFavorite from 'hooks/favorite/is-favorite';

// services
import {
  createFavourite,
  deleteFavourite,
} from 'services/favourites';
import {
  fetchArea,
} from 'services/areas';
import {
  fetchGeostore,
} from 'services/geostore';

// constants
import {
  DEFAULT_VIEWPORT,
  MAPSTYLES,
  USER_AREA_LAYER_TEMPLATES,
} from 'components/map/constants';

// utils
import { paramIsTrue } from 'utils/utils';
import { isLoadedExternally } from 'utils/embed';
import { getUserAreaLayer } from 'components/map/utils';

const LayoutEmbedMap = (props) => {
  const {
    widget,
    isLoading,
    isError,
    layerGroups,
    user,
    webshot,
    mapProps: {
      basemap,
      labels,
      boundaries,
      bounds,
    },
    activeLayers,
    activeInteractiveLayers,
  } = props;
  const {
    query: {
      disableZoom,
      legendExpanded,
      aoi,
    },
  } = useRouter();
  const [mapState, setMapState] = useState({
    viewport: DEFAULT_VIEWPORT,
    interaction: {
      data: {},
      selected: 0,
      point: null,
    },
    bounds,
  });
  const [displayedLayers, setDisplayedLayers] = useState([
    ...activeLayers,
  ]);
  const [modalVisibility, setModalVisibility] = useState();

  const {
    name,
    description,
    dataset,
    id,
    thumbnailUrl,
  } = widget || {};
  const {
    isFavorite,
    data: favorite,
    refetch: refetchFavorites,
  } = useIsFavorite(widget?.id, user?.token);

  const handleModalVisibility = useCallback(() => {
    const toggleVisibility = !modalVisibility;
    setModalVisibility(toggleVisibility);
  }, [modalVisibility]);

  const toggleFavorite = useCallback(async () => {
    const toggleIsFavorite = !isFavorite;
    if (toggleIsFavorite) {
      try {
        await createFavourite(user.token, {
          resourceType: 'widget',
          resourceId: id,
        });
        refetchFavorites();
      } catch (e) {
        // do something
      }
    } else {
      try {
        await deleteFavourite(user.token, favorite.id);
        refetchFavorites();
      } catch (e) {
        // do something
      }
    }
  }, [isFavorite, id, favorite, user, refetchFavorites]);

  const onChangeInteractiveLayer = useCallback((selected) => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      interaction: {
        ...prevMapState.interaction,
        selected,
      },
    }));
  }, []);

  const onClickLayer = useCallback(({ features, lngLat }) => {
    const { interaction } = mapState;
    let interactions = {};

    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message
    if (!features.length) {
      interactions = Object.keys(interaction.data).reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: {},
      }), {});
    } else {
      interactions = features.reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.layer.source]: { data: currentValue.properties },
      }), {});
    }

    setMapState((prevMapState) => ({
      ...prevMapState,
      interaction: {
        ...prevMapState.interaction,
        data: interactions,
        point: {
          longitude: lngLat[0],
          latitude: lngLat[1],
        },
      },
    }));
  }, [mapState]);

  const [handleViewport] = useDebouncedCallback((viewport) => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      viewport,
    }));
  }, 250);

  const handleZoom = useCallback((zoom) => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      viewport: {
        ...prevMapState.viewport,
        zoom,
        // transitionDuration is always set to avoid mixing
        // durations of other actions (like flying)
        transitionDuration: 250,
      },
    }));
  }, []);

  const handleResetView = useCallback(() => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      viewport: {
        bearing: 0,
        pitch: 0,
        // transitionDuration is always set to avoid mixing
        // durations of other actions (like flying)
        transitionDuration: 250,
      },
    }));
  }, []);

  const handleClosePopup = useCallback(() => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      interaction: {
        data: {},
        selected: 0,
        point: null,
      },
    }));
  }, []);

  useEffect(() => {
    setDisplayedLayers((prevLayers) => [
      ...prevLayers.filter(({ provider }) => provider === 'geojson'),
      ...activeLayers,
    ]);
  }, [activeLayers]);

  useEffect(() => {
    setMapState((prevMapState) => ({
      ...prevMapState,
      bounds,
    }));
  }, [bounds]);

  useEffect(() => {
    const cancelToken = CancelToken.source();

    const fetchAreaOfInterest = async () => {
      try {
        const { geostore: geostoreId } = await fetchArea(aoi, {}, {
          Authorization: user.token,
          cancelToken: cancelToken.token,
        });
        const {
          geojson,
          bbox,
        } = await fetchGeostore(geostoreId, { cancelToken: cancelToken.token });

        const aoiLayer = getUserAreaLayer(
          {
            id: geostoreId,
            geojson,
          },
          USER_AREA_LAYER_TEMPLATES.explore,
        );

        setDisplayedLayers((prevLayers) => [
          aoiLayer,
          ...prevLayers.filter(({ provider }) => provider !== 'geojson'),
        ]);

        setMapState((prevMapState) => ({
          ...prevMapState,
          bounds: {
            bbox,
            options: {
              padding: 50,
            },
          },
        }));
      } catch (e) {
        //  do something
      }
    };

    if (user.token) fetchAreaOfInterest();

    return () => { cancelToken.cancel('Fetching geostore: operation canceled by the user.'); };
  }, [aoi, user]);

  const {
    viewport,
    interaction,
    bounds: mapBounds,
  } = mapState;
  const { pitch, bearing } = viewport;
  const favoriteIcon = isFavorite ? 'star-full' : 'star-empty';
  const isExternal = typeof window !== 'undefined' ? isLoadedExternally(window?.location?.href) : false;
  const resetViewBtnClass = classnames({
    '-with-transition': true,
    '-visible': pitch !== 0 || bearing !== 0,
  });

  return (
    <>
      {isLoading && (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <div className="c-embed-widget -map">
            <Spinner
              isLoading={isLoading}
              className="-light"
            />
          </div>
        </LayoutEmbed>
      )}

      {isError && (
        <LayoutEmbed
          title="Resource Watch"
          description=""
        >
          <div className="c-embed-widget -map">
            <div className="widget-title">
              <h4>–</h4>
            </div>
            <div className="widget-content">
              <p>{'Sorry, the widget couldn\'t be loaded'}</p>
            </div>

            {isExternal && (
              <div className="widget-footer">
                <Link
                  href="/"
                >
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="embed-logo"
                      src="/static/images/logo-embed.png"
                      alt="Resource Watch"
                    />
                  </a>
                </Link>
              </div>
            )}
          </div>
        </LayoutEmbed>
      )}

      {!isLoading && (
        <LayoutEmbed
          title={name}
          description={`${description || ''}`}
          {...thumbnailUrl && { thumbnailUrl }}
        >
          <div className="c-embed-widget -map">
            {!webshot && (
              <div className="widget-title">
                <Link
                  href={`/explore/${dataset}`}
                >
                  <a
                    href={`/explore/${dataset}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h4>{name}</h4>
                  </a>
                </Link>
                <div className="buttons">
                  {
                    (user?.id) && (
                      <button
                        type="button"
                        onClick={toggleFavorite}
                      >
                        <Icon name={`icon-${favoriteIcon}`} className="c-icon -small" />
                      </button>
                    )
                  }
                  <button
                    type="button"
                    aria-label={`${modalVisibility ? 'Close' : 'Open'} information modal`}
                    onClick={handleModalVisibility}
                  >
                    <Icon name={`icon-${modalVisibility ? 'cross' : 'info'}`} className="c-icon -small" />
                  </button>
                </div>
              </div>
            )}

            <div className={classnames('widget-content', { '-external': isExternal })}>
              <Map
                mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
                onClick={onClickLayer}
                interactiveLayerIds={activeInteractiveLayers}
                mapStyle={MAPSTYLES}
                viewport={viewport}
                basemap={basemap}
                labels={labels}
                bounds={mapBounds}
                fitBoundsOptions={{ transitionDuration: 0 }}
                boundaries={boundaries}
                scrollZoom={false}
                onViewportChange={handleViewport}
              >
                {(_map) => (
                  <>
                    <LayerManager
                      map={_map}
                      layers={displayedLayers}
                    />

                    {!isEmpty(interaction.point)
                      && activeLayers.length
                      && !isEmpty(interaction.data) && (
                      <Popup
                        {...interaction.point}
                        closeButton
                        closeOnClick={false}
                        onClose={handleClosePopup}
                        className="rw-popup-layer"
                        maxWidth="250px"
                      >
                        <LayerPopup
                          data={{
                            // data available in certain point
                            layersInteraction: interaction.data,
                            // ID of the layer will display data (defaults into the first layer)
                            layersInteractionSelected: interaction.selected,
                            // current active layers to get their layerConfig attributes
                            layers: activeLayers,
                          }}
                          latlng={{
                            lat: interaction.point.latitude,
                            lng: interaction.point.longitude,
                          }}
                          onChangeInteractiveLayer={onChangeInteractiveLayer}
                        />
                      </Popup>
                    )}
                  </>
                )}
              </Map>

              {!webshot && (
                <MapControls>
                  {!paramIsTrue(disableZoom) && (
                    <ZoomControls
                      viewport={viewport}
                      onClick={handleZoom}
                    />
                  )}
                  <ResetViewControls
                    className={resetViewBtnClass}
                    onResetView={handleResetView}
                  />
                </MapControls>
              )}

              <div className="c-legend-map -embed">
                <Legend
                  maxHeight={200}
                  sortable={false}
                  expanded={paramIsTrue(!!legendExpanded)}
                >
                  {layerGroups.map((lg, i) => (
                    <LegendListItem
                      index={i}
                      key={lg.dataset}
                      layerGroup={lg}
                    >
                      <LegendItemTypes />
                    </LegendListItem>
                  ))}
                </Legend>
              </div>
              {modalVisibility && (
                <div className="widget-modal">
                  {(!description && !widget?.metadata[0]) && (
                    <p>No additional information is available</p>
                  )}
                  {description && (
                    <>
                      <h4>Description</h4>
                      <p>{description}</p>
                    </>
                  )}
                  {widget?.metadata && widget?.metadata[0]?.info?.widgetLinks && (
                    <div className="widget-links-container">
                      <h4>Links</h4>
                      <ul>
                        {widget.metadata[0].info.widgetLinks.map(({ name: linkName, link }) => (
                          <li key={link}>
                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {linkName}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            {(widget?.metadata && widget?.metadata[0]?.info?.caption && !modalVisibility) && (
              <div className="caption-container">
                {widget.metadata[0].info.caption}
              </div>
            )}
            {(isExternal && !webshot) && (
              <div className="widget-footer -map">
                Powered by
                <Link
                  href="/"
                >
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="embed-logo"
                      src="/static/images/logo-embed.png"
                      alt="Resource Watch"
                    />
                  </a>
                </Link>
              </div>
            )}
          </div>
        </LayoutEmbed>
      )}
    </>
  );
};

LayoutEmbedMap.propTypes = {
  widget: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    dataset: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          caption: PropTypes.string,
          widgetLinks: PropTypes.arrayOf(
            PropTypes.shape({
              name: PropTypes.string,
              link: PropTypes.string,
            }),
          ),
        }),
      }),
    ).isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  mapProps: PropTypes.shape({
    basemap: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
    boundaries: PropTypes.bool.isRequired,
    bounds: PropTypes.shape({}).isRequired,
  }).isRequired,
  activeLayers: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  layerGroups: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  activeInteractiveLayers: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  webshot: PropTypes.bool.isRequired,
};

export default LayoutEmbedMap;
