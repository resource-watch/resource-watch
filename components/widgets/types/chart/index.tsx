import { useSelector } from 'react-redux';

import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useMe } from 'hooks/user';

// utils
import { getParametrizedWidget } from 'utils/widget';
import { getRWAdapter } from 'utils/widget-editor';

// components
import Chart from './component';
import type { CSSProperties } from 'react';
import { APIWidgetSpec } from 'types/widget';

export interface ChartContainerProps {
  widgetId: string;
  params?: Record<string, string | number | unknown>;
  onToggleShare: (widget: APIWidgetSpec) => void;
  style?: CSSProperties;
  isEmbed?: boolean;
  isWebshot?: boolean;
  encodeParams?: boolean;
}

const ChartContainer = ({
  widgetId,
  params,
  onToggleShare,
  style = {},
  isEmbed = false,
  isWebshot = false,
  encodeParams = true,
}: ChartContainerProps): JSX.Element => {
  const RWAdapter = useSelector((state) => getRWAdapter(state));
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
      adapter={RWAdapter}
      style={style}
      isEmbed={isEmbed}
      isWebshot={isWebshot}
      isFetching={isFetching}
      isError={isError}
      isInACollection={isInACollection}
      onToggleShare={onToggleShare}
    />
  );
};

export default ChartContainer;
