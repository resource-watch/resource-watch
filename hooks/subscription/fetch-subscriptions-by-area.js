import {
  useMemo,
} from 'react';

import useFetchSubscriptions from 'hooks/subscription/fetch-subscriptions';

const useSubscriptionsByArea = (areaId, token) => {
  const {
    data: subscriptions,
    ...fetcherProps
  } = useFetchSubscriptions(
    token,
    {},
    {
      enable: areaId,
      initialData: [],
      initialStale: true,
    },
  );

  const subscriptionsByArea = useMemo(() => subscriptions
    .filter(({ params }) => params.area === areaId),
  [subscriptions, areaId]);

  return ({
    data: subscriptionsByArea,
    ...fetcherProps,
  });
};

export default useSubscriptionsByArea;
