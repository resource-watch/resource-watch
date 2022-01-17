import EmbedTypeWidget from './component';

import useBelongsToCollection from 'hooks/collection/belongs-to-collection';
import { useMe } from 'hooks/user';

import { useFetchWidget } from 'hooks/widget';

export interface EmbedTypeWidgetContainerProps {
  widgetId: string;
  iframeProps?: Partial<HTMLIFrameElement>;
  onToggleShare: (show: boolean) => void;
}

const EmbedTypeWidgetContainer = ({
  widgetId,
  iframeProps,
  onToggleShare,
}: EmbedTypeWidgetContainerProps): JSX.Element => {
  const { data: widget, isLoading } = useFetchWidget(
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
    <>
      <EmbedTypeWidget
        widget={widget}
        isFetching={isLoading}
        iframeProps={iframeProps}
        isInACollection={isInACollection}
        onToggleShare={onToggleShare}
      />
    </>
  );
};

export default EmbedTypeWidgetContainer;
