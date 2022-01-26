import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import MapWidget from 'components/widgets/types/map';
import PoweredBy from 'components/embed/powered-by';

// utils
import { isLoadedExternally } from 'utils/embed';

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), {
  ssr: false,
});

const isExternal = isLoadedExternally();

export default function LayoutEmbedMap({ widget, widgetId, aoi, params, isWebshot }) {
  const [widgetToShare, setWidgetToShare] = useState(null);

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  useEffect(() => {
    if (!isWebshot) return null;

    // see https://resource-watch.github.io/doc-api/reference.html#webshot
    // it waits until 2 seconds to notify is ready to screenshot
    const timerId = window.setTimeout(() => {
      window.WEBSHOT_READY = true;
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isWebshot]);

  return (
    <LayoutEmbed
      title={widget?.name}
      description={`${widget?.description || ''}`}
      {...(widget?.thumbnailUrl && { thumbnailUrl: widget.thumbnailUrl })}
    >
      <div className="c-embed-widget widget-content">
        <MapWidget
          widgetId={widgetId}
          isEmbed
          onToggleShare={handleShareWidget}
          {...(aoi && { areaOfInterest: aoi })}
          {...(isWebshot && { isWebshot: true })}
          params={params}
        />

        {isExternal && !isWebshot && <PoweredBy />}
      </div>
      {!!widgetToShare && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
          params={{
            ...(aoi && { aoi }),
            ...params,
          }}
        />
      )}
    </LayoutEmbed>
  );
}

LayoutEmbedMap.defaultProps = {
  aoi: null,
  isWebshot: false,
  params: {},
};

LayoutEmbedMap.propTypes = {
  widget: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
  }).isRequired,
  widgetId: PropTypes.string.isRequired,
  aoi: PropTypes.string,
  params: PropTypes.shape({}),
  isWebshot: PropTypes.bool,
};
