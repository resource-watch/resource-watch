import { useRouter } from 'next/router';

// components
import LayoutEmbedMapSwipe from 'layout/embed/map-swipe';

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
    <LayoutEmbedMapSwipe
      widgetId={id}
      {...webshot && { isWebshot: true }}
      {...aoi && { aoi }}
      params={restQueryParams}
    />
  );
}
