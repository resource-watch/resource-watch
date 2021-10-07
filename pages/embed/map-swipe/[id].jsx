import { useRouter } from 'next/router';

// components
import LayoutEmbedMapSwipeWidget from 'layout/embed/map-swipe-widget';

export default function EmbedMapSwipePage() {
  const {
    query: {
      id,
      webshot,
      aoi,
      ...restQueryParams
    },
  } = useRouter();

  return (
    <LayoutEmbedMapSwipeWidget
      widgetId={id}
      {...webshot && { isWebshot: true }}
      {...aoi && { aoi }}
      params={restQueryParams}
    />
  );
}
