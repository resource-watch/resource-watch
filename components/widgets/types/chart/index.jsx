import PropTypes from 'prop-types';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import {
  useMe,
} from 'hooks/user';

// utils
import {
  isStagingAPI,
} from 'utils/api';
import {
  getParametrizedWidget,
} from 'utils/widget';

// components
import Chart from './component';

const isStaging = isStagingAPI();

export default function ChartContainer({
  widgetId,
  adapter,
  areaOfInterest,
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
      select: (_widget) => getParametrizedWidget(_widget, {
        ...areaOfInterest && { geostore_id: areaOfInterest },
        geostore_env: isStaging ? 'geostore_staging' : 'geostore_prod',
      }),
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

ChartContainer.defaultProps = {
  areaOfInterest: null,
};

ChartContainer.propTypes = {
  widgetId: PropTypes.string.isRequired,
  areaOfInterest: PropTypes.string,
  adapter: PropTypes.func.isRequired,
  onToggleShare: PropTypes.func.isRequired,
};
