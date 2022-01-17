import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useMe } from 'hooks/user';

// utils
import { getParametrizedWidget } from 'utils/widget';

// components
import Chart from './component';

export default function ChartContainer({
  widgetId,
  adapter,
  params,
  onToggleShare,
  style,
  isEmbed,
  isWebshot,
  encodeParams,
}) {
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widgetId, user?.token);

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
      select: (_widget) => getParametrizedWidget(_widget, params, encodeParams),
    },
  );

  return (
    <Chart
      widget={widget}
      adapter={adapter}
      style={style}
      isEmbed={isEmbed}
      isWebshot={isWebshot}
      isFetching={isFetching}
      isError={isError}
      isInACollection={isInACollection}
      onToggleShare={onToggleShare}
    />
  );
}

ChartContainer.defaultProps = {
  params: {},
  style: {},
  isEmbed: false,
  isWebshot: false,
};

ChartContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  params: PropTypes.shape({}),
  style: PropTypes.shape({}),
  isEmbed: PropTypes.bool,
  isWebshot: PropTypes.bool,
  adapter: PropTypes.func.isRequired,
  onToggleShare: PropTypes.func.isRequired,
};
