import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';
import dynamic from 'next/dynamic';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import ChartWidget from 'components/widgets/types/chart';
import PoweredBy from 'components/embed/powered-by';

// utils
import {
  getRWAdapter,
} from 'utils/widget-editor';
import { isLoadedExternally } from 'utils/embed';

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), { ssr: false });

const isExternal = isLoadedExternally();

export default function LayoutEmbedWidget({
  widgetId,
  widget,
  params,
  isWebshot,
}) {
  const [widgetToShare, setWidgetToShare] = useState(null);
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const handleShareWidget = useCallback((_widget) => {
    setWidgetToShare(_widget);
  }, []);

  const handleCloseShareWidget = useCallback(() => {
    setWidgetToShare(null);
  }, []);

  useEffect(() => {
    // see https://resource-watch.github.io/doc-api/reference.html#isWebshot
    // it waits until 2 seconds to notify is ready to screenshot
    const timerId = window.setTimeout(() => {
      window.isWebshot_READY = true;
    }, 2000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  return (
    <LayoutEmbed
      title={widget.name}
      description={`${widget.description || ''}`}
      {...widget.thumbnailUrl && { thumbnailUrl: widget.thumbnailUrl }}
    >
      <div className="c-embed-widget widget-content">
        <ChartWidget
          adapter={RWAdapter}
          widgetId={widgetId}
          params={params}
          onToggleShare={handleShareWidget}
          isEmbed
          {...isWebshot && { isWebshot: true }}
          style={{
            ...(isExternal && !isWebshot) && { height: 'calc(100% - 56px)' },
          }}
        />
        {((isExternal && !isWebshot)) && (
          <PoweredBy />
        )}
      </div>
      {widgetToShare && (
        <WidgetShareModal
          isVisible
          widget={widgetToShare}
          onClose={handleCloseShareWidget}
        />
      )}
    </LayoutEmbed>
  );
}

LayoutEmbedWidget.defaultProps = {
  isWebshot: false,
  params: {},
};

LayoutEmbedWidget.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  widget: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    dataset: PropTypes.string,
    widgetConfig: PropTypes.shape({}),
    metadata: PropTypes.arrayOf(
      PropTypes.shape({
        info: PropTypes.shape({
          widgetLinks: PropTypes.arrayOf(
            PropTypes.shape({
              link: PropTypes.string,
            }),
          ),
        }),
      }),
    ),
  }).isRequired,
  isWebshot: PropTypes.bool,
};
