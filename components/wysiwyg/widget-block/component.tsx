import { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// components
import InView from 'components/in-view';
import MapWidget from 'components/widgets/types/map';
import ChartWidget from 'components/widgets/types/chart';
import EmbedWidget from 'components/widgets/types/embed';

import type { APIWidgetSpec } from 'types/widget';

const WidgetShareModal = dynamic(() => import('../../../components/widgets/share-modal'), {
  ssr: false,
});

export interface WidgetBlockProps {
  widget: APIWidgetSpec;
}

const WidgetBlock = ({ widget }: WidgetBlockProps): JSX.Element => {
  const [showModal, setShowModal] = useState(false);

  const openShareModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const widgetType = useMemo(() => widget?.widgetConfig?.type || 'chart', [widget]);

  return (
    <div className="w-full h-full">
      {widgetType === 'map' && (
        <InView triggerOnce threshold={0.25}>
          {({ ref, inView }) => (
            <div ref={ref} className="w-full h-full">
              {inView && <MapWidget widgetId={widget.id} onToggleShare={openShareModal} />}
            </div>
          )}
        </InView>
      )}

      {widget && widgetType === 'chart' && (
        <ChartWidget widgetId={widget.id} onToggleShare={openShareModal} encodeParams={false} />
      )}

      {widgetType === 'embed' && (
        <InView triggerOnce threshold={0.25}>
          {({ ref, inView }) => (
            <div ref={ref} className="w-full h-full">
              {inView && <EmbedWidget widgetId={widget.id} onToggleShare={openShareModal} />}
            </div>
          )}
        </InView>
      )}

      {showModal && (
        <WidgetShareModal isVisible widget={widget} onClose={closeShareModal} params={{}} />
      )}
    </div>
  );
};

export default WidgetBlock;
