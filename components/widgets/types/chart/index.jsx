import PropTypes from 'prop-types';
import {
  useSelector,
} from 'react-redux';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

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
