// hooks
import { useFetchWidget } from 'hooks/widget';

import LayoutWidgetDetail from './component';

// types
import type { WidgetDetailPageProps } from 'pages/data/widget/[id]';
import type { APIWidgetSpec } from 'types/widget';

const LayoutWidgetDetailContainer = ({
  widgetId,
  queryParams,
}: WidgetDetailPageProps): JSX.Element => {
  const { data: widget } = useFetchWidget(
    widgetId,
    {},
    {
      enabled: Boolean(widgetId),
    },
  );

  return <LayoutWidgetDetail widget={widget as APIWidgetSpec} params={queryParams} />;
};

export default LayoutWidgetDetailContainer;
