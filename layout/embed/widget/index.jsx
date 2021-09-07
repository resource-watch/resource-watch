import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';

// components
import LayoutEmbedWidget from './component';

export default function LayoutEmbedWidgetContainer({
  widgetId,
  ...props
}) {
  const {
    data: widget,
  } = useFetchWidget(
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

  return (
    <LayoutEmbedWidget
      widget={widget}
      widgetId={widgetId}
      {...props}
    />
  );
}

LayoutEmbedWidgetContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
};
