import { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { replace } from '@vizzuality/layer-manager-utils';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import ChartWidget from 'components/widgets/types/chart';
import PoweredBy from 'components/embed/powered-by';

// hooks
import { useGeostore } from 'hooks/geostore';

import { isLoadedExternally } from 'utils/embed';
import { APIWidgetSpec } from 'types/widget';

export interface LayoutEmbedWidgetProps {
  widgetId: string;
  widget: APIWidgetSpec;
  params: Record<string, string | number>;
  isWebshot: boolean;
}

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), {
  ssr: false,
});

const isExternal = isLoadedExternally();

const LayoutEmbedWidget = ({
  widgetId,
  widget,
  params,
  isWebshot,
}: LayoutEmbedWidgetProps): JSX.Element => {
  const [widgetToShare, setWidgetToShare] = useState<APIWidgetSpec>(null);

  const handleShareWidget = useCallback((_widget: APIWidgetSpec) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  const { data: geostoreProperties } = useGeostore(
    params.geostore_id as string,
    {},
    {
      enabled: Boolean(params.geostore_id),
      select: (geostore) => {
        if (!geostore) return {};
        return geostore.geojson.features[0].properties || {};
      },
      placeholderData: null,
    },
  );

  useEffect(() => {
    // see https://resource-watch.github.io/doc-api/reference.html#isWebshot
    // it waits until 2 seconds to notify is ready to screenshot
    const timerId = window.setTimeout(() => {
      window.WEBSHOT_READY = true;
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const updatedParams = useMemo(
    () => ({ ...params, ...(geostoreProperties as Record<string, string | number>) }),
    [params, geostoreProperties],
  );

  return (
    <LayoutEmbed
      title={replace(widget.name, updatedParams)}
      description={`${widget.description || ''}`}
      {...(widget.thumbnailUrl && { thumbnailUrl: widget.thumbnailUrl })}
    >
      <div className="c-embed-widget widget-content">
        <ChartWidget
          widgetId={widgetId}
          params={updatedParams}
          encodeParams={false}
          onToggleShare={handleShareWidget}
          isEmbed
          {...(isWebshot && { isWebshot: true })}
          style={{
            ...(isExternal && !isWebshot && { height: 'calc(100% - 56px)' }),
          }}
        />
        {isExternal && !isWebshot && <PoweredBy />}
      </div>
      {widgetToShare && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
          params={{}}
        />
      )}
    </LayoutEmbed>
  );
};

export default LayoutEmbedWidget;
