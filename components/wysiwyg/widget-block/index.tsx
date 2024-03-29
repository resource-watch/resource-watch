import { useFetchWidget } from 'hooks/widget';

import WidgetBlock from './component';

import type { WYSIWYGItem } from 'types/wysiwyg';
import type { APIWidgetSpec } from 'types/widget';

export interface WidgetBlockContainerProps {
  item: WYSIWYGItem;
}

const WidgetBlockContainer = ({ item }: WidgetBlockContainerProps): JSX.Element => {
  const { data: widget } = useFetchWidget(
    item?.content?.widgetId,
    { includes: 'metadata' },
    {
      enabled: Boolean(item?.content?.widgetId),
      refetchOnWindowFocus: false,
    },
  );

  return <WidgetBlock widget={widget as APIWidgetSpec} />;
};

export default WidgetBlockContainer;
