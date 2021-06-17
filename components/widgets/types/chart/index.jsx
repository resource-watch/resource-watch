import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import {
  useMe,
} from 'hooks/user';

// components
import Chart from './component';

export default function ChartContainer({
  widgetId,
  adapter,
  onToggleShare,
}) {
  const {
    data: user,
  } = useMe();
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, user?.token);

  const {
    data: widget,
    isFetching,
    isError,
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
    <Chart
      widget={widget}
      adapter={adapter}
      isFetching={isFetching}
      isError={isError}
      isInACollection={isInACollection}
      onToggleShare={onToggleShare}
    />
  );
}

ChartContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  adapter: PropTypes.func.isRequired,
  onToggleShare: PropTypes.func.isRequired,
};
