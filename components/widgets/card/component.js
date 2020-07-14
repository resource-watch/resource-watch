import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';
import truncate from 'lodash/truncate';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Tooltip } from 'vizzuality-components';

// services
import { deleteWidget } from 'services/widget';
import { fetchLayer } from 'services/layer';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

// utils
import {
  isMapWidget,
  isEmbedWidget,
  isTextualWidget
} from 'utils/widget';
import { logEvent } from 'utils/analytics';

// constants
import { MAPSTYLES } from 'components/map/constants';
import { INITIAL_STATE, REDUCER } from 'components/widgets/card/constants';

// components
import Title from 'components/ui/Title';
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import LoginRequired from 'components/ui/login-required';
import CollectionsPanel from 'components/collections-panel';
import WidgetChart from 'components/charts/widget-chart';
import LayerChart from 'components/charts/layer-chart';
import ShareModal from 'components/modal/share-modal';
import TextChart from 'components/widgets/charts/TextChart';
import WidgetActionsTooltip from './tooltip';

// styles
import './styles.scss';

const WidgetCard = (props) => {
  const {
    widget,
    mode,
    user,
    limitChar,
    showActions,
    showEmbed,
    showRemove,
    thumbnail
  } = props;

  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);
  const {
    loading,
    mapLoading,
    layer,
    error,
    tooltip
  } = state;

  const handleRemoveVisualization = () => {
    const { user: { token }, onWidgetRemove } = props;
    const { id, name, dataset } = widget;

    toastr.confirm(`Are you sure you want to remove the visualization: ${name}?`, {
      onOk: () => {
        deleteWidget(id, dataset, token)
          .then(() => { onWidgetRemove(); })
          .catch(({ message }) => toastr.error('Something went wrong deleting the widget', message));
      }
    });
  };

  const handleEmbed = () => {
    const { toggleModal, setModalOptions } = props;
    const { id, widgetConfig } = widget;
    const widgetType = widgetConfig.type || 'widget';
    const location = typeof window !== 'undefined' && window.location;
    const { origin } = location;
    const options = {
      children: ShareModal,
      childrenProps: {
        links: {
          link: `${origin}/data/widget/${id}`,
          embed: location && `${origin}/embed/${widgetType}/${id}`
        },
        analytics: {
          facebook: () => logEvent('Share', `Share widget: ${id}`, 'Facebook'),
          twitter: () => logEvent('Share', `Share widget: ${id}`, 'Twitter'),
          copy: type => logEvent('Share', `Share widget: ${id}`, `Copy ${type}`)
        },
        toggleModal
      }
    };

    toggleModal(true);
    setModalOptions(options);
  };

  const handleEditWidget = () => {
    const { user: { role, id } } = props;
    const isOwner = widget.userId === id;
    const isAdmin = role === 'ADMIN';

    if (isAdmin) {
      Router.pushRoute('admin_data_detail', { tab: 'widgets', subtab: 'edit', id: widget.id, dataset: widget.dataset });
    } else if (isOwner) {
      Router.pushRoute('myrw_detail', { tab: 'widgets', subtab: 'edit', id: widget.id });
    } else {
      Router.pushRoute('myrw_detail', { tab: 'widget_detail', id: widget.id });
    }
  };

  const handleGoToDataset = () => {
    const { dataset } = widget;

    Router.pushRoute('explore', { dataset });
  };

  const handleDownloadPDF = () => {
    toastr.info('Widget download', 'The file is being generated...');

    const { id, name, widgetConfig } = widget;
    const type = widgetConfig.type || 'widget';
    const { origin } = window.location;
    const filename = encodeURIComponent(name);

    const link = document.createElement('a');
    link.setAttribute('download', '');
    link.href = `${process.env.CONTROL_TOWER_URL}/v1/webshot/pdf?filename=${filename}&width=790&height=580&waitFor=8000&url=${origin}/embed/${type}/${id}`;

    // link.click() doesn't work on Firefox for some reasons
    // so we have to create an event manually
    const event = new MouseEvent('click');
    link.dispatchEvent(event);
  };

  const handleTooltipVisibility = (visible) => { dispatch({ type: 'WIDGET-CARD/SET_TOOLTIP', payload: visible }); };

  const getLayer = (layerId) => {
    dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: true });
    dispatch({ type: 'WIDGET-CARD/SET_ERROR', payload: null });

    fetchLayer(layerId)
      .then((_layer) => {
        dispatch({ type: 'WIDGET-CARD/SET_LAYER', payload: _layer });
      })
      .catch(() => { dispatch({ type: 'WIDGET-CARD/SET_ERROR', payload: 'There was an issue rendering the visualization' }); })
      .finally(() => { dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: false }); });
  };

  const getWidgetPreview = () => {
    if (!widget) return null;

    if (loading || (!layer && isMapWidget(widget.widgetConfig))) {
      return (
        <div className={`c-widget-chart -${mode} -map`}>
          <Spinner className="-light" isLoading />
        </div>
      );
    }

    if (error) {
      toastr.error('Error', error);
      // TODO: Correctly show the UI
      return null;
    }

    // If the widget is an embedded page, we render a
    // different component
    if (isEmbedWidget(widget.widgetConfig)) {
      if (mode === 'grid') {
        return (
          <div className="c-widget-chart -thumbnail">
            <div className="c-we-chart -no-preview">
              <span>No preview</span>
            </div>
          </div>
        );
      }

      return (
        <div className="c-widget-chart -embed">
          <iframe
            title={widget.name}
            src={widget.widgetConfig.paramsConfig.embed.src}
            frameBorder="0"
          />
        </div>
      );
    }

    // If the widget is a map, we render the correct component
    if (isMapWidget(widget.widgetConfig)) {
      // We render the thumbnail of a map
      if (mode === 'grid') {
        return (<LayerChart layer={layer} />);
      }

      const { widgetConfig: { basemapLayers, bbox } } = widget;
      const { basemap, boundaries, labels } = basemapLayers;

      return (
        <div className="c-widget-chart -map">
          <Spinner
            isLoading={mapLoading}
            className="-light"
          />
          <Map
            mapboxApiAccessToken={process.env.RW_MAPBOX_API_TOKEN}
            interactiveLayerIds={[]}
            mapStyle={MAPSTYLES}
            bounds={{
              bbox,
              options: {}
            }}
            fitBoundsOptions={{ transitionDuration: 0 }}
            basemap={basemap}
            labels={labels}
            boundaries={boundaries}
            reuseMaps
            visible={!mapLoading}
            dragPan={false}
            dragRotate={false}
            scrollZoom={false}
            doubleClickZoom={false}
            touchRotate={false}
            onLoad={({ map }) => {
              map.on('render', () => {
                if (map.areTilesLoaded()) {
                  dispatch({ type: 'WIDGET-CARD/SET_MAP_LOADING', payload: false });
                  map.off('render');
                }
              });
            }}
          >
            {_map => (
              <LayerManager
                map={_map}
                layers={[layer]}
              />
            )}
          </Map>
        </div>
      );
    }

    // If the widget is a textual one, it's rendered differently
    if (isTextualWidget(widget.widgetConfig)) {
      return (
        <div className={`c-widget-chart -${mode}`}>
          <TextChart widgetConfig={widget.widgetConfig} />
        </div>
      );
    }

    // We render a Vega chart
    return (
      <WidgetChart
        widget={widget}
        thumbnail={thumbnail}
      />
    );
  };

  useEffect(() => {
    if (isMapWidget(widget.widgetConfig)) {
      const layerId = (widget.widgetConfig.paramsConfig
        && widget.widgetConfig.paramsConfig.layer)
        || widget.widgetConfig.layer_id;

      getLayer(layerId);
    }
  }, [widget]);

  const widgetLinks = (widget.metadata && widget.metadata.length > 0 &&
    widget.metadata[0].info &&
    widget.metadata[0].info.widgetLinks) || [];
  const isWidgetOwner = widget.userId === user.id;

  const isInACollection = belongsToACollection(user, widget);

  const starIconName = classnames({
    'icon-star-full': isInACollection,
    'icon-star-empty': !isInACollection
  });

  return (
    <div className="c-widget-card">
      <div className="widget-preview">
        {getWidgetPreview()}
      </div>
      <div className="info">
        <div
          className="detail"
          // tabIndex={-1}
          // role="button"
          // onClick={() => this.props.onWidgetClick && this.props.onWidgetClick(widget)}
        >
          {/* Title */}
          <Title className="-default -primary">
            {widget.name}
          </Title>
          <p>
            {truncate(widget.description, { length: limitChar, separator: ' ', omission: '...' })}
          </p>
          <LoginRequired>
            <Tooltip
              overlay={
                <CollectionsPanel
                  resource={widget}
                  resourceType="widget"
                />
              }
              overlayClassName="c-rc-tooltip"
              overlayStyle={{ color: '#fff' }}
              placement="bottomLeft"
              trigger="click"
            >
              <button
                type="button"
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
        </div>

        {(showActions || showRemove || showEmbed) &&
          <div className="actions">
            {showActions && (

              <Tooltip
                visible={tooltip}
                overlayClassName="c-rc-tooltip -default -no-max-width"
                placement="top"
                destroyTooltipOnHide
                overlay={
                  <WidgetActionsTooltip
                    toggleTooltip={() => { handleTooltipVisibility(false); }}
                    onShareEmbed={handleEmbed}
                    onGoToDataset={handleGoToDataset}
                    onEditWidget={handleEditWidget}
                    onDownloadPDF={handleDownloadPDF}
                    onRemove={handleRemoveVisualization}
                    widgetLinks={widgetLinks}
                    isWidgetOwner={isWidgetOwner}
                  />
                }
              >

                <button
                  className="c-button -secondary widget-actions"
                  onClick={() => { handleTooltipVisibility(!tooltip); }}
                >
                  Options
                </button>
              </Tooltip>
            )}
            <button
              type="button"
              className="c-button"
              onClick={handleEditWidget}
            >
              Edit
            </button>
          </div>
        }
      </div>
    </div>
  );
};

WidgetCard.propTypes = {
  widget: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showRemove: PropTypes.bool,
  showEmbed: PropTypes.bool,
  mode: PropTypes.oneOf(['grid', 'full']).isRequired,
  onWidgetRemove: PropTypes.func.isRequired,
  limitChar: PropTypes.number,
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  thumbnail: PropTypes.bool
};

WidgetCard.defaultProps = {
  showActions: false,
  showRemove: false,
  limitChar: 70,
  showEmbed: false,
  thumbnail: false
};

export default WidgetCard;
