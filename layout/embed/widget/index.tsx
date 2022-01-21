// hooks
import { useFetchWidget } from 'hooks/widget';

// components
import LayoutEmbedWidget from './component';

import type { EmbedWidgetPageProps } from 'pages/embed/widget/[id]';

const LayoutEmbedWidgetContainer = ({ widgetId, ...props }: EmbedWidgetPageProps): JSX.Element => {
  const { data: widget } = useFetchWidget(
    widgetId,
    {
      includes: 'metadata',
    },
    {
      enabled: !!widgetId,
      refetchOnWindowFocus: false,
      placeholderData: {},
    },
  );

  return <LayoutEmbedWidget widget={widget} widgetId={widgetId} {...props} />;
};
export default LayoutEmbedWidgetContainer;
