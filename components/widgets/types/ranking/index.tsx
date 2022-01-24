import { useMemo } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { replace } from '@vizzuality/layer-manager-utils';
import { ErrorBoundary } from 'react-error-boundary';

// hooks
import { useFetchWidget } from 'hooks/widget';
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useMe } from 'hooks/user';

// component
import ErrorFallback from 'components/error-fallback';
import RankingWidget from './component';

// types
import type { APIWidgetSpec } from 'types/widget';

const CustomErrorFallback = (_props) => (
  <ErrorFallback {..._props} title="Something went wrong loading the widget" />
);

export interface RankingWidgetContainerProps {
  widgetId: string;
  params?: Record<string, string | number | unknown>;
  onToggleShare: (widget: APIWidgetSpec) => void;
}

const RankingWidgetContainer = ({
  widgetId,
  params = {},
  onToggleShare,
}: RankingWidgetContainerProps): JSX.Element => {
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widgetId, user?.token);

  const {
    data: widget,
    isError: isErrorWidget,
    refetch: refetchWidget,
  } = useFetchWidget(
    widgetId,
    {
      includes: 'metadata',
    },
    {
      enabled: Boolean(widgetId),
      refetchOnWindowFocus: false,
      select: (_widget) => ({
        ..._widget,
        widgetConfig: {
          ..._widget.widgetConfig,
          url: replace(_widget.widgetConfig.url, params),
        },
      }),
    },
  );

  const {
    data,
    isFetching,
    isError: isErrorWidgetURL,
  } = useQuery(`widget-url-${widgetId}`, () => axios.get(widget.widgetConfig.url), {
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.rows?.[0],
    enabled: Boolean(widget?.widgetConfig?.url),
  });

  const isError = useMemo(
    () => isErrorWidgetURL || isErrorWidget,
    [isErrorWidgetURL, isErrorWidget],
  );

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onReset={() => {
        refetchWidget();
      }}
    >
      <RankingWidget
        data={data}
        widget={widget as APIWidgetSpec}
        params={params}
        isInACollection={isInACollection}
        isFetching={isFetching}
        isError={isError}
        onToggleShare={onToggleShare}
      />
    </ErrorBoundary>
  );
};

export default RankingWidgetContainer;
