import { useRouter } from 'next/router';

// components
import LayoutEmbedMap from 'layout/embed/map';

const EmbedMapPage = () => {
  const {
    query: {
      id,
      webshot,
      aoi,
    },
  } = useRouter();

  return (
    <LayoutEmbedMap
      widgetId={id}
      {...webshot && { isWebshot: true }}
      {...aoi && { aoi }}
    />
  );
};

export default EmbedMapPage;
