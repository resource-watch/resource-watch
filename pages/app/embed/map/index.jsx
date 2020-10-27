import React from 'react';
import { useRouter } from 'next/router';

// components
import LayoutEmbedMap from 'layout/embed/map';

// hooks
import useFetchWidget from 'hooks/widget/fetch-widget';
import useFetchLayer from 'hooks/layer/fetch-layer';

const EmbedMapPage = () => {
  const {
    query: {
      id,
      webshot,
    },
  } = useRouter();

  const fetchWidgetState = useFetchWidget(
    id,
    { includes: ['metadata'].join(',') },
    {
      initialData: {},
      initialStale: true,
      refetchOnWindowFocus: false,
    },
  );
  const { data } = fetchWidgetState;

  const fetchLayerState = useFetchLayer(
    data?.widgetConfig?.paramsConfig?.layer,
    {},
    {
      enabled: data?.widgetConfig?.paramsConfig?.layer,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <LayoutEmbedMap
      fetchWidgetState={fetchWidgetState}
      fetchLayerState={fetchLayerState}
      webshot={!!webshot}
    />
  );
};

export default EmbedMapPage;
