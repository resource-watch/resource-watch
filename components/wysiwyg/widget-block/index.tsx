import { useSelector } from 'react-redux';
import { useFetchWidget } from 'hooks/widget';

import WidgetBlock from './component';

import { getRWAdapter } from 'utils/widget-editor';
import type { WYSIWYGItem } from 'types/wysiwyg';

export interface WidgetBlockContainerProps {
  item: WYSIWYGItem;
}

const WidgetBlockContainer = ({ item }: WidgetBlockContainerProps): JSX.Element => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));

  const { data: widget } = useFetchWidget(
    item?.content?.widgetId,
    { includes: 'metadata' },
    {
      enabled: Boolean(item?.content?.widgetId),
      refetchOnWindowFocus: false,
    },
  );

  return <WidgetBlock RWAdapter={RWAdapter} widget={widget} />;
};

export default WidgetBlockContainer;
