import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { Popup } from 'react-map-gl';
import {
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';
import { Link } from 'routes';

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

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES } from 'components/map/constants';

// utils
import { paramIsTrue } from 'utils/utils';
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedMap extends PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    mapProps: PropTypes.object.isRequired,
    activeLayers: PropTypes.array.isRequired,
    layerGroups: PropTypes.array.isRequired,
    activeInteractiveLayers: PropTypes.array.isRequired,
    error: PropTypes.string,
    favourited: PropTypes.bool.isRequired,
    referer: PropTypes.string,
    user: PropTypes.object.isRequired,
    url: PropTypes.object.isRequired,
    webshot: PropTypes.bool.isRequired,
    checkIfFavorited: PropTypes.func.isRequired,
    setIfFavorited: PropTypes.func.isRequired
  };

  static defaultProps = {
    error: null,
    referer: ''
  };

  state = {
    modalOpened: false,
    viewport: DEFAULT_VIEWPORT,
    interaction: {
      data: {},
      selected: 0,
      point: null
    }
  }

  componentWillMount() {
    const {
      url: { query: { id } },
      user,
      mapProps: { viewport }
    } = this.props;

    this.setState({ viewport });

    if (user && user.id) this.props.checkIfFavorited(id);
  }

  onChangeInteractiveLayer = (selected) => {
    this.setState({
      interaction: {
        ...this.state.interaction,
        selected
      }
    });
  }

  onClickLayer = ({ features, lngLat }) => {
    const { interaction } = this.state;
    let interactions = {};

    // if the user clicks on a zone where there is no data in any current layer
    // we will reset the current interaction of those layers to display "no data available" message
    if (!features.length) {
      interactions = Object.keys(interaction.data).reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue]: {}
      }), {});
    } else {
      interactions = features.reduce((accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.layer.source]: { data: currentValue.properties }
      }), {});
    }

    const _lngLat = {
      longitude: lngLat[0],
      latitude: lngLat[1]
    };

    this.setState({
      interaction: {
        ...this.state.interaction,
        data: interactions,
        point: _lngLat
      }
    });
  }

  getModal() {
    const { widget: { description } } = this.props;

    return (
      <div className="widget-modal">
        {!description &&
          <p>No additional information is available</p>}
        {description && (
          <div>
            <h4>Description</h4>
            <p>{description}</p>
          </div>)}
      </div>
    );
  }

  handleViewport = debounce((viewport) => {
    this.setState({ viewport });
  }, 250)

  handleZoom = (zoom) => {
    const { viewport: currentViewport } = this.state;

    this.setState({
      viewport: {
        ...currentViewport,
        zoom
      }
    });
  }

  handleResetView = () => {
    this.setState({
      viewport: {
        bearing: 0,
        pitch: 0,
        // transitionDuration is always set to avoid mixing
        // durations of other actions (like flying)
        transitionDuration: 250
      }
    });
  }

  handleClosePopup = () => {
    this.setState({
      interaction: {
        data: {},
        selected: 0,
        point: null
      }
    });
  }

  render() {
    const {
      widget,
      loading,
      layerGroups,
      error,
      favourited,
      user,
      url: { query: { disableZoom, legendExpanded } },
      referer,
      webshot,
      mapProps: {
        basemap,
        labels,
        boundaries,
        bounds
      },
      activeLayers,
      activeInteractiveLayers
    } = this.props;
    const { viewport, interaction, modalOpened } = this.state;
    const favouriteIcon = favourited ? 'star-full' : 'star-empty';
    const isExternal = isLoadedExternally(referer);
    const {
      name,
      description,
      dataset,
      id,
      thumbnailUrl
    } = widget;
    const { pitch, bearing } = viewport;
    const resetViewBtnClass = classnames({
      '-with-transition': true,
      '-visible': pitch !== 0 || bearing !== 0
    });    

    if (loading) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""
        >
          <div className="c-embed-widget -map">
            <Spinner
              isLoading={loading}
              className="-light"
            />
          </div>
        </LayoutEmbed>
      );
    }

    if (error) {
      return (
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
                <Link route="home">
                  <a
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
      );
    }

    return (
      <LayoutEmbed
        title={name}
        description={`${description || ''}`}
        {...thumbnailUrl && { thumbnailUrl }}
      >
        <div className="c-embed-widget -map">
          {!webshot && (
            <div className="widget-title">
              <Link
                route="explore"
                params={{ dataset }}
              >
                <a target="_blank" rel="noopener noreferrer">
                  <h4>{name}</h4>
                </a>
              </Link>
              <div className="buttons">
                {
                  user && user.id && (
                    <button
                      onClick={() => this.props.setIfFavorited(id, !this.props.favourited)}
                    >
                      <Icon name={`icon-${favouriteIcon}`} className="c-icon -small" />
                    </button>
                  )
                }
                <button
                  aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                  onClick={() => this.setState({ modalOpened: !modalOpened })}
                >
                  <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
                </button>
              </div>
            </div>)}

          <div className={classnames('widget-content', { '-external': isExternal })}>
            <Map
              mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
              onClick={this.onClickLayer}
              interactiveLayerIds={activeInteractiveLayers}
              mapStyle={MAPSTYLES}
              viewport={viewport}
              basemap={basemap}
              labels={labels}
              bounds={bounds}
              boundaries={boundaries}
              scrollZoom={false}
              onViewportChange={this.handleViewport}
            >
              {_map =>
               (
                <Fragment>
                  <LayerManager
                    map={_map}
                    layers={activeLayers}
                  />

                  {!isEmpty(interaction.point) &&
                    activeLayers.length &&
                    !isEmpty(interaction.data) &&
                    <Popup
                      {...interaction.point}
                      closeButton
                      closeOnClick={false}
                      onClose={this.handleClosePopup}
                      className="rw-popup-layer"
                      maxWidth="250px"
                    >
                      <LayerPopup
                        data={{
                          // data available in certain point
                          layersInteraction: interaction.data,
                          // ID of the layer will display data (defualts into the first layer)
                          layersInteractionSelected: interaction.selected,
                          // current active layers to get their layerConfig attributes
                          layers: activeLayers
                        }}
                        latlng={{
                          lat: interaction.point.latitude,
                          lng: interaction.point.longitude
                        }}
                        onChangeInteractiveLayer={this.onChangeInteractiveLayer}
                      />
                    </Popup>
                  }
                </Fragment>
              )}
            </Map>

            {!webshot && (
              <MapControls>
                {!paramIsTrue(disableZoom) && (
                  <ZoomControls
                    viewport={viewport}
                    onClick={this.handleZoom}
                  />)}
                <ResetViewControls
                  className={resetViewBtnClass}
                  onResetView={this.handleResetView}
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
            {modalOpened && this.getModal()}
          </div>
          {(isExternal && !webshot) && (
            <div className="widget-footer -map">
              Powered by
              <Link route="home">
                <a
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
    );
  }
}

export default LayoutEmbedMap;
