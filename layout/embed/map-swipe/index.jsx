import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';

// components
import LayoutEmbedMap from './component';

export default function LayoutEmbedMapSwipeContainer({
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
    <LayoutEmbedMap
      widget={widget}
      widgetId={widgetId}
      {...props}
    />
  );
}

LayoutEmbedMapSwipeContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
};
