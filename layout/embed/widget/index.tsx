// hooks
import { useFetchWidget } from 'hooks/widget';

// components
import LayoutEmbedWidget from './component';

// types
import type { EmbedWidgetPageProps } from 'pages/embed/widget/[id]';
import type { APIWidgetSpec } from 'types/widget';

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

  return <LayoutEmbedWidget widget={widget as APIWidgetSpec} widgetId={widgetId} {...props} />;
};
export default LayoutEmbedWidgetContainer;
