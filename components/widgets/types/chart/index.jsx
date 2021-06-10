import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// components
import Chart from './component';

export default function ChartContainer({
  widgetId,
  adapter,
  onToggleShare,
}) {
  const userToken = useSelector((state) => state.user?.token);
  const {
    isInACollection,
  } = useBelongsToCollection(widgetId, userToken);

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
