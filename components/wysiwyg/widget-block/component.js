import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import Renderer from '@widget-editor/renderer';

import {
  Tooltip,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

// components
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import MapControls from 'components/map/controls';
import ZoomControls from 'components/map/controls/zoom';
import TextChart from 'components/widgets/charts/TextChart';
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import ErrorBoundary from 'components/ui/error-boundary';

// constants
import { DEFAULT_VIEWPORT, MAPSTYLES, BASEMAPS, LABELS } from 'components/map/constants';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

// const defaultTheme = getVegaTheme();

class WidgetBlock extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object,
    item: PropTypes.object,
    onToggleModal: PropTypes.func,
    onToggleLoading: PropTypes.func
  };

  static defaultProps = {
    data: {},
    item: {},
    onToggleModal: null,
    onToggleLoading: null
  };

  state = {
    shareWidget: null,
    viewport: DEFAULT_VIEWPORT,
    isInitMap: false
  }

  componentDidUpdate() {
    const { viewport, isInitMap } = this.state;
    if (
      isInitMap === false &&
      viewport.latitude === 0 &&
      viewport.longitude === 0
    ) {
      this.setViewportByProps();
    }
  }

  /** A function that sets default map viewport from props */
  setViewportByProps = () => {
    const { data, item } = this.props;
    const { viewport } = this.state;
    let newViewport = viewport;
    const id = `${item.content.widgetId}/${item.id}`;
    if (!data[id]) {
      return null;
    }
    const { widget: { widgetConfig }, widgetType } = data[id];
    if (widgetType && widgetType === 'map' && widgetConfig) {
      const { lat, lng, zoom } = widgetConfig;
      const center = { latitude: lat, longitude: lng, zoom };
      newViewport = { ...viewport, ...center };
      this.setState({
        viewport: newViewport,
        isInitMap: true
      });
    }
    return true;
  }

  getMapBounds(widget = {}) {
    const { widgetConfig } = widget;
    if (!widgetConfig) return {};

    if (widgetConfig.bbox) return { bbox: widgetConfig.bbox };

    return {};
  }

  getMapBasemap(widget = {}) {
    const { widgetConfig } = widget;
    if (!widgetConfig) return {};

    const basemap = (!!widgetConfig.basemapLayers && !!widgetConfig.basemapLayers.basemap) ? widgetConfig.basemapLayers.basemap : 'dark';

    return BASEMAPS[basemap].value;
  }

  getMapLabel(widget = {}) {
    const { widgetConfig } = widget;
    if (!widgetConfig) return {};

    const label = (!!widgetConfig.basemapLayers && !!widgetConfig.basemapLayers.labels) ? widgetConfig.basemapLayers.labels : 'light';

    return LABELS[label].value;
  }

  handleToggleShareModal = (widget) => {
    this.setState({ shareWidget: widget });
  }

  handleViewport = (viewportNew) => {
    this.setState({ viewport: { ...viewportNew } });
  }

  handleZoom = (zoom) => {
    const { viewport } = this.state;
    this.setState({
      viewport: {
        ...viewport,
        zoom,
        transitionDuration: 250
      }
    });
  }

  render() {
    const {
      user,
      data,
      item,
      onToggleModal,
      onToggleLoading
    } = this.props;

    const { viewport, isInitMap } = this.state;

    const id = `${item.content.widgetId}/${item.id}`;

    if (!data[id]) {
      return null;
    }

    const {
      widget,
      widgetType,
      widgetLoading,
      widgetError,
      widgetModal,
      layers,
      layersLoading,
      layersError
    } = data[id];

    const metadataInfo = (widget && (widget.metadata && widget.metadata.length > 0 &&
      widget.metadata[0].info)) || {};

    const widgetLinks = metadataInfo.widgetLinks || [];
    const widgetIsEmbed = widget && widget.widgetConfig && widget.widgetConfig.type === 'embed';
    const widgetEmbedUrl = widgetIsEmbed && widget.widgetConfig.url;
    const caption = metadataInfo && metadataInfo.caption;
    const componentClass = classnames('c-widget-block', { [`-${widgetType}`]: !!widgetType });
    const isInACollection = belongsToACollection(user, widget);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const modalIcon = classnames({
      'icon-cross': widgetModal,
      'icon-info': !widgetModal
    });

    const filteredLayers = [];
    layers.map(
      layerGroup => layerGroup.layers.filter(
        l => l.active === true
      ).forEach(
        l => filteredLayers.push(l)
      )
    );

    return (
      <div className={componentClass}>
        <header>
          <div className="header-container">
            <Title className="-default">{widget ? widget.name : '–'}</Title>

            <div className="buttons">
              <ul>
                <li>
                  <button className="c-btn -tertiary -clean" onClick={() => this.handleToggleShareModal(widget)}>
                    <Icon
                      name="icon-share"
                      className="-small"
                    />
                  </button>

                  <Modal
                    isOpen={this.state.shareWidget === widget}
                    className="-medium"
                    onRequestClose={() => this.handleToggleShareModal(null)}
                  >
                    <ShareModal
                      links={{
                        link: typeof window !== 'undefined' && `${window.location.origin}/embed/${widgetType}/${widget.id}`,
                        embed: typeof window !== 'undefined' && `${window.location.origin}/embed/${widgetType}/${widget.id}`
                      }}
                      analytics={{
                        facebook: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Facebook'),
                        twitter: () => logEvent('Share (embed)', `Share widget: ${widget.name}`, 'Twitter'),
                        email: () => logEvent('Share', `Share widget: ${widget.name}`, 'Email'),
                        copy: type => logEvent('Share (embed)', `Share widget: ${widget.name}`, `Copy ${type}`)
                      }}
                    />
                  </Modal>
                </li>

                <li>
                  <LoginRequired>
                    <Tooltip
                      overlay={<CollectionsPanel
                        resource={widget}
                        resourceType="widget"
                      />}
                      overlayClassName="c-rc-tooltip"
                      overlayStyle={{ color: '#fff' }}
                      placement="bottomLeft"
                      trigger="click"
                    >
                      <button
                        className="c-btn favourite-button"
                        tabIndex={-1}
                      >
                        <Icon
                          name={starIconName}
                          className="-star -small"
                        />
                      </button>
                    </Tooltip>
                  </LoginRequired>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onToggleModal(!widgetModal)}
                  >
                    <Icon name={modalIcon} className="-small" />
                  </button>
                </li>
              </ul>

            </div>
          </div>
        </header>

        <ErrorBoundary message="There was an error loading the visualization">
          <div className="widget-container">
            <Spinner isLoading={widgetLoading || layersLoading} className="-light -small" />

            {!widgetError && widgetType === 'text' && widget &&
              <TextChart
                widgetConfig={widget.widgetConfig}
                toggleLoading={loading => onToggleLoading(loading)}
              />
            }

            {!widgetError && widgetType === 'widget' && widget.widgetConfig && widget &&
              <Renderer widgetConfig={widget.widgetConfig} />
            }

            {widgetIsEmbed &&
              <iframe title={widget.name} src={widgetEmbedUrl} width="100%" height="100%" frameBorder="0" />
            }

            {!isEmpty(widget) && !widgetLoading && !widgetError && !layersError && widgetType === 'map' && layers && isInitMap && (
              <Fragment>
                <div className="c-map">
                  <Map
                    mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
                    mapStyle={MAPSTYLES}
                    viewport={viewport}
                    basemap={this.getMapBasemap(widget)}
                    onViewportChange={this.handleViewport}
                    labels={this.getMapLabel(widget)}
                    scrollZoom={false}
                    bounds={this.getMapBounds(widget)}
                  >
                    {_map => (
                      <Fragment>
                        <LayerManager
                          map={_map}
                          layers={filteredLayers}
                        />
                      </Fragment>
                    )}
                  </Map>
                  <MapControls customClass="c-map-controls -embed">
                    <ZoomControls
                      viewport={viewport}
                      onClick={this.handleZoom}
                    />
                  </MapControls>
                </div>

                <div className="c-legend-map -embed">
                  <Legend
                    maxHeight={140}
                    sortable={false}
                  >
                    {layers.map((lg, i) => (
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
              </Fragment>
            )}

            {!widgetError && !layersError && !item && !item.content.widgetId &&
              <div className="message">
                <div className="no-data">No data</div>
              </div>
            }

            {(widgetError || layersError) &&
              <div className="message">
                <div className="error">Unable to load</div>
              </div>
            }

            {widgetModal &&
              <div className="widget-modal">
                {widget && !widget.description &&
                  <p>No additional information is available</p>
                }

                {widget && widget.description && (
                  <div>
                    <h4>Description</h4>
                    <p>{widget.description}</p>
                  </div>
                )}

                {widgetLinks.length > 0 &&
                  <div className="widget-links-container">
                    <h4>Links</h4>
                    <ul>
                      {widgetLinks.map(link => (
                        <li>
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              </div>
            }
          </div>
        </ErrorBoundary>


        {caption &&
          <div className="caption-container">
            {caption}
          </div>
        }
      </div>
    );
  }
}

export default WidgetBlock;
