import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import { VegaChart, getVegaTheme } from 'widget-editor';
import {
  Map,
  MapControls,
  ZoomControl,
  Tooltip,
  Legend,
  LegendListItem,
  LegendItemTypes
} from 'vizzuality-components';

import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginLeaflet } from 'layer-manager';

// components
import TextChart from 'components/widgets/charts/TextChart';
import LoginRequired from 'components/ui/login-required';
import Icon from 'components/ui/Icon';
import Title from 'components/ui/Title';
import Spinner from 'components/ui/Spinner';
import CollectionsPanel from 'components/collections-panel';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';

// constants
import { BASEMAPS, LABELS } from 'components/ui/map/constants';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// utils
import { logEvent } from 'utils/analytics';

// styles
import './styles.scss';

const defaultTheme = getVegaTheme();

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

  state = { shareWidget: null }

  getMapOptions(widget = {}) {
    if (!widget.widgetConfig) return {};
    const { widgetConfig: { lat, lng, zoom } } = widget;

    if (lat && lng && zoom) {
      return {
        zoom,
        center: {
          lat,
          lng
        }
      };
    }

    return {};
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

    return {
      url: BASEMAPS[basemap].value,
      options: BASEMAPS[basemap].options
    };
  }

  getMapLabel(widget = {}) {
    const { widgetConfig } = widget;
    if (!widgetConfig) return {};

    const label = (!!widgetConfig.basemapLayers && !!widgetConfig.basemapLayers.labels) ? widgetConfig.basemapLayers.labels : 'light';

    return {
      url: LABELS[label].value,
      options: LABELS[label].options
    };
  }

  handleToggleShareModal(widget) {
    this.setState({ shareWidget: widget });
  }

  render() {
    const {
      user,
      data,
      item,
      onToggleModal,
      onToggleLoading
    } = this.props;

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

        <div className="widget-container">
          <Spinner isLoading={widgetLoading || layersLoading} className="-light -small" />

          {!widgetError && widgetType === 'text' && widget &&
            <TextChart
              widgetConfig={widget.widgetConfig}
              toggleLoading={loading => onToggleLoading(loading)}
            />
          }

          {!widgetError && widgetType === 'widget' && widget.widgetConfig && widget &&
            <VegaChart
              data={widget.widgetConfig}
              theme={defaultTheme}
              toggleLoading={loading => onToggleLoading(loading)}
              reloadOnResize
            />
          }

          {widgetIsEmbed &&
            <iframe title={widget.name} src={widgetEmbedUrl} width="100%" height="100%" frameBorder="0" />
          }

          {!isEmpty(widget) && !widgetLoading && !widgetError && !layersError && widgetType === 'map' && layers && (
            <Fragment>
              <div className="c-map">
                <Map
                  mapOptions={this.getMapOptions(widget)}
                  bbox={this.getMapBounds(widget)}
                  basemap={this.getMapBasemap(widget)}
                  label={this.getMapLabel(widget)}
                  scrollZoomEnabled={false}
                >
                  {map => (
                    <Fragment>
                      {/* Controls */}
                      <MapControls customClass="c-map-controls -embed">
                        <ZoomControl map={map} />
                      </MapControls>

                      {/* LayerManager */}
                      <LayerManager map={map} plugin={PluginLeaflet}>
                        {flatten(layers.map(layerGroup =>
                          layerGroup.layers.filter(l => l.active === true))).map((l, i) => (
                            <Layer
                              {...l}
                              key={l.id}
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

              { widgetLinks.length > 0 &&
                <div className="widget-links-container">
                  <h4>Links</h4>
                  <ul>
                    { widgetLinks.map(link => (
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
