import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import truncate from 'lodash/truncate';
import classnames from 'classnames';
import { toastr } from 'react-redux-toastr';
import { Tooltip } from 'vizzuality-components';
import { saveAs } from 'file-saver';
import dateFnsFormat from 'date-fns/format';

// services
import { deleteWidget } from 'services/widget';
import { fetchLayer } from 'services/layer';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// utils
import { isMapWidget, isEmbedWidget, isTextualWidget, getWidgetType } from 'utils/widget';
import { getLinksByWidgetType } from 'utils/embed';
import { logEvent } from 'utils/analytics';

// constants
import { MAPSTYLES } from 'components/map/constants';
import { INITIAL_STATE, REDUCER } from 'components/widgets/card/reducer';

// components
import Title from 'components/ui/Title';
import Icon from 'components/ui/icon';
import Spinner from 'components/ui/Spinner';
import Map from 'components/map';
import LayerManager from 'components/map/layer-manager';
import LoginRequired from 'components/ui/login-required';
import CollectionsPanel from 'components/collections-panel';
import WidgetChart from 'components/charts/widget-chart';
import MapThumbnail from 'components/map/thumbnail';
import ShareModal from 'components/modal/share-modal';
import TextChart from 'components/widgets/charts/TextChart';
import WidgetActionsTooltip from './tooltip';
import { useMe } from 'hooks/user';

// types
import type { APIWidgetSpec } from 'types/widget';

export interface WidgetCardProps {
  widget: APIWidgetSpec;
  mode: 'grid' | 'list';
  limitChar?: number;
  showActions?: boolean;
  showEmbed?: boolean;
  showRemove?: boolean;
  showFavorite?: boolean;
  thumbnail?: boolean;
  clickable?: boolean;
  params?: Record<string, string>;
  onWidgetClick?: (widget: APIWidgetSpec) => void;
  onWidgetRemove: () => void;
  setModalOptions: (options) => void;
  toggleModal: (visibility: boolean) => void;
}

const WidgetCard = ({
  widget,
  mode,
  limitChar = 70,
  showActions = false,
  showEmbed = false,
  showRemove = false,
  showFavorite = true,
  thumbnail = false,
  clickable = false,
  params = {},
  onWidgetClick,
  onWidgetRemove,
  toggleModal,
  setModalOptions,
}: WidgetCardProps): JSX.Element => {
  const router = useRouter();
  const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);
  const { loading, mapLoading, layer, error, tooltip } = state;
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widget.id, user?.token);
  const widgetType = useMemo(() => getWidgetType(widget), [widget]);

  const handleRemoveVisualization = useCallback(() => {
    const { id, name, dataset } = widget;

    toastr.confirm(`Are you sure you want to remove the visualization: ${name}?`, {
      onOk: () => {
        deleteWidget(id, dataset, user?.token)
          .then(() => {
            onWidgetRemove();
          })
          .catch(({ message }) =>
            toastr.error('Something went wrong deleting the widget', message),
          );
      },
    });
  }, [user, widget, onWidgetRemove]);

  const handleEmbed = useCallback(() => {
    const { id } = widget;
    const options = {
      children: ShareModal,
      childrenProps: {
        links: getLinksByWidgetType(widget, params),
        analytics: {
          facebook: () => logEvent('Share', `Share widget: ${id}`, 'Facebook'),
          twitter: () => logEvent('Share', `Share widget: ${id}`, 'Twitter'),
          copy: (type) => logEvent('Share', `Share widget: ${id}`, `Copy ${type}`),
        },
        toggleModal,
      },
    };

    toggleModal(true);
    setModalOptions(options);
  }, [params, widget, toggleModal, setModalOptions]);

  const handleEditWidget = useCallback(() => {
    if (user?.role === 'ADMIN') {
      router.push(`/admin/data/widgets/${widget.id}/edit?dataset=${widget.dataset}`);
    } else if (widget.userId === user?.id) {
      router.push(`/myrw-detail/widgets/${widget.id}/edit`);
    } else {
      router.push(`/data/widget/${widget.id}`);
    }
  }, [router, user, widget]);

  const handleGoToDataset = useCallback(() => {
    const { dataset } = widget;

    router.push(`/data/explore/${dataset}`);
  }, [router, widget]);

  const handleDownloadPDF = useCallback(async () => {
    toastr.info('Downloading PDF...', 'This process might take a few seconds.');

    const { id } = widget;
    const { origin } = window.location;
    const destinyQueryParams = new URLSearchParams(params);
    const url = new URL(`${origin}/embed/${widgetType}/${id}`);
    const queryParams = new URLSearchParams({
      filename: widget.slug,
      width: '790',
      height: '580',
      waitFor: '8000',
    });

    const webshot = `${
      process.env.NEXT_PUBLIC_WRI_API_URL
    }/v1/webshot?${queryParams.toString()}&url=${encodeURIComponent(
      `${url}?${destinyQueryParams}`,
    )}`;

    toggleModal(false);
    saveAs(webshot, `${widget.slug}-${dateFnsFormat(Date.now(), "yyyy-MM-dd'T'HH:mm:ss")}.pdf`);
  }, [widget, params, widgetType, toggleModal]);

  const handleTooltipVisibility = useCallback((visible) => {
    dispatch({ type: 'WIDGET-CARD/SET_TOOLTIP', payload: visible });
  }, []);

  const getLayer = async (layerId) => {
    dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: true });
    dispatch({ type: 'WIDGET-CARD/SET_ERROR', payload: null });

    try {
      const layerData = await fetchLayer(layerId);
      dispatch({ type: 'WIDGET-CARD/SET_LAYER', payload: layerData });
      dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: false });
    } catch (e) {
      dispatch({
        type: 'WIDGET-CARD/SET_ERROR',
        payload: 'There was an issue rendering the visualization',
      });
      dispatch({ type: 'WIDGET-CARD/SET_LOADING', payload: false });
    }
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
        return <MapThumbnail layer={layer} />;
      }

      const {
        widgetConfig: { basemapLayers, bbox },
      } = widget;
      const { basemap, boundaries, labels } = basemapLayers;

      return (
        <div className="c-widget-chart -map">
          <Spinner isLoading={mapLoading} className="-light" />
          <Map
            interactiveLayerIds={[]}
            mapStyle={MAPSTYLES}
            bounds={{
              bbox,
              options: {},
            }}
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
            onMapLoad={({ map }) => {
              map.on('render', () => {
                if (map.areTilesLoaded()) {
                  dispatch({ type: 'WIDGET-CARD/SET_MAP_LOADING', payload: false });
                  map.off('render');
                }
              });
            }}
          >
            {(_map) => <LayerManager map={_map} layers={[layer]} />}
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
    return <WidgetChart widget={widget} thumbnail={thumbnail} />;
  };

  useEffect(() => {
    if (isMapWidget(widget.widgetConfig)) {
      const layerId =
        (widget.widgetConfig.paramsConfig && widget.widgetConfig.paramsConfig.layer) ||
        widget.widgetConfig.layer_id;

      getLayer(layerId);
    }
  }, [widget]);

  const widgetLinks = useMemo(() => widget?.metadata?.[0]?.info?.widgetLinks || [], [widget]);
  const isWidgetOwner = useMemo(() => widget.userId === user?.id, [widget, user]);

  return (
    <div
      className={classnames({
        'c-widget-card': true,
        '-clickable': clickable,
      })}
      {...(clickable && {
        tabIndex: -1,
        role: 'button',
        onClick: () => onWidgetClick && onWidgetClick(widget),
        onKeyPress: () => onWidgetClick && onWidgetClick(widget),
      })}
    >
      <div className="widget-preview">{getWidgetPreview()}</div>
      <div className="info">
        <div className="detail">
          {/* Title */}
          <Title className="-default -primary">{widget.name}</Title>
          <p>
            {truncate(widget.description, { length: limitChar, separator: ' ', omission: '...' })}
          </p>
          {showFavorite && (
            <LoginRequired>
              <Tooltip
                overlay={<CollectionsPanel resource={widget} resourceType="widget" />}
                overlayClassName="c-rc-tooltip"
                overlayStyle={{ color: '#fff' }}
                placement="bottomLeft"
                trigger="click"
              >
                <button type="button" className="c-btn favourite-button" tabIndex={-1}>
                  <Icon
                    name={classnames({
                      'icon-star-full': isInACollection,
                      'icon-star-empty': !isInACollection,
                    })}
                    className="-star -small"
                  />
                </button>
              </Tooltip>
            </LoginRequired>
          )}
        </div>

        {(showActions || showRemove || showEmbed) && (
          <div className="actions">
            {showActions && (
              <Tooltip
                visible={tooltip}
                overlayClassName="c-rc-tooltip -default -no-max-width"
                placement="top"
                destroyTooltipOnHide
                overlay={
                  <WidgetActionsTooltip
                    toggleTooltip={() => {
                      handleTooltipVisibility(false);
                    }}
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
                  onClick={() => {
                    handleTooltipVisibility(!tooltip);
                  }}
                >
                  Options
                </button>
              </Tooltip>
            )}
            <button type="button" className="c-button" onClick={handleEditWidget}>
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetCard;
