import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from 'components/error-fallback';

import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useMe } from 'hooks/user';
import { useFetchWidget } from 'hooks/widget';

import EmbedTypeWidget from './component';

// types
import type { APIWidgetSpec } from 'types/widget';

const CustomErrorFallback = (_props) => (
  <ErrorFallback {..._props} title="Something went wrong loading the widget" />
);

export interface EmbedTypeWidgetContainerProps {
  widgetId: string;
  onToggleShare: (widget: APIWidgetSpec) => void;
}

const EmbedTypeWidgetContainer = ({
  widgetId,
  onToggleShare,
}: EmbedTypeWidgetContainerProps): JSX.Element => {
  const {
    data: widget,
    isLoading,
    refetch: refetchWidget,
  } = useFetchWidget(
    widgetId,
    { includes: 'metadata' },
    {
      enabled: Boolean(widgetId),
      refetchOnWindowFocus: false,
    },
  );
  const { data: user } = useMe();
  const { isInACollection } = useBelongsToCollection(widgetId, user?.token);

  return (
    <ErrorBoundary
      FallbackComponent={CustomErrorFallback}
      onReset={() => {
        refetchWidget();
      }}
    >
      <EmbedTypeWidget
        widget={widget as APIWidgetSpec}
        isFetching={isLoading}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
      />
    </ErrorBoundary>
  );
};

export default EmbedTypeWidgetContainer;
