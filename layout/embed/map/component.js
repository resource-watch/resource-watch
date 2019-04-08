import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import flatten from 'lodash/flatten';
import {
  Map,
  MapControls,
  ZoomControl,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import Spinner from 'components/ui/Spinner';
import Icon from 'components/ui/Icon';

// constants
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// utils
import { paramIsTrue } from 'utils/utils';
import { isLoadedExternally } from 'utils/embed';

class LayoutEmbedMap extends PureComponent {
  static propTypes = {
    widget: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    layerGroups: PropTypes.array.isRequired,
    error: PropTypes.string,
    zoom: PropTypes.number.isRequired,
    latLng: PropTypes.object.isRequired,
    favourited: PropTypes.bool.isRequired,
    referer: PropTypes.string,
    user: PropTypes.object.isRequired,
    url: PropTypes.object.isRequired,
    webshot: PropTypes.bool.isRequired,
    toggleLayerGroupVisibility: PropTypes.func.isRequired,
    checkIfFavorited: PropTypes.func.isRequired,
    setIfFavorited: PropTypes.func.isRequired
  };

  static defaultProps = {
    error: null,
    referer: ''
  };

  state = { modalOpened: false }

  componentDidMount() {
    const {
      url,
      user
    } = this.props;
    const { query } = url;
    if (user && user.id) this.props.checkIfFavorited(query.id);
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  onLayerLoading = (isLoading) => {
    if (!isLoading) {
      this.timeout = setTimeout(() => {
        window.WEBSHOT_READY = true;
      }, 3000);
    }
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

  render() {
    const {
      widget,
      loading,
      layerGroups,
      error,
      zoom,
      latLng,
      favourited,
      user,
      url,
      referer,
      webshot
    } = this.props;
    const { modalOpened } = this.state;
    const { disableZoom, legendExpanded } = url.query;
    const favouriteIcon = favourited ? 'star-full' : 'star-empty';
    const isExternal = isLoadedExternally(referer);
    const {
      name,
      description,
      dataset,
      widgetConfig,
      id,
      thumbnailUrl
    } = widget;

    if (loading) {
      return (
        <LayoutEmbed
          title="Loading widget..."
          description=""

        >
          <div className="c-embed-widget -map">
            <Spinner isLoading={loading} className="-light" />
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

            { isExternal && (
              <div className="widget-footer">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src="/static/images/logo-embed.png"
                    alt="Resource Watch"
                  />
                </a>
              </div>
            ) }
          </div>
        </LayoutEmbed>
      );
    }


    // widget loaded
    const basemap = (!!widgetConfig.basemapLayers && !!widgetConfig.basemapLayers.basemap) ? widgetConfig.basemapLayers.basemap : 'dark';
    const label = (!!widgetConfig.basemapLayers && !!widgetConfig.basemapLayers.labels) ? widgetConfig.basemapLayers.labels : 'light';

    return (
      <LayoutEmbed
        title={name}
        description={`${description || ''}`}
        {...thumbnailUrl && { thumbnailUrl }}
      >
        <div className="c-embed-widget -map">
          {!webshot && (
            <div className="widget-title">
              <a href={`/data/explore/${dataset}`} target="_blank" rel="noopener noreferrer">
                <h4>{name}</h4>
              </a>
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
            <div className="c-map">
              <Map
                mapOptions={{
                  zoom,
                  center: latLng
                }}
                basemap={{
                  url: BASEMAPS[basemap].value,
                  options: BASEMAPS[basemap].options
                }}
                label={{
                  url: LABELS[label].value,
                  options: LABELS[label].options
                }}
                scrollZoomEnabled={false}
              >
                {map => (
                  <Fragment>
                    {/* Controls */}
                    {!webshot &&
                      <MapControls
                        customClass="c-map-controls -embed"
                      >
                        {!paramIsTrue(disableZoom) &&
                          <ZoomControl map={map} />}
                      </MapControls>}

                    {/* LayerManager */}
                    <LayerManager
                      map={map}
                      plugin={PluginLeaflet}
                      onLayerLoading={this.onLayerLoading}
                      // It shouldn't be here
                      // onLayerReady={(l) => { if (!l) window.WEBSHOT_READY = true; }}
                    >
                      {flatten(layerGroups.map(lg =>
                        lg.layers.filter(l => l.active === true))).map((l, i) => (
                          <Layer
                            {...l}
                            key={l.id}
                            opacity={l.opacity || 1}
                            zIndex={1000 - i}
                          />
                        ))}
                    </LayerManager>
                  </Fragment>
                )}
              </Map>
            </div>

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
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src="/static/images/logo-embed.png"
                  alt="Resource Watch"
                />
              </a>
            </div>
          )}
        </div>
      </LayoutEmbed>
    );
  }
}

export default LayoutEmbedMap;
