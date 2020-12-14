import { useQuery } from 'react-query';

// services
import { fetchSubscriptions } from 'services/subscriptions';

const fetcher = (key, token, params) => fetchSubscriptions(token, params);

const useFetchSubscriptions = (token, params = {}, queryConfig = {}) => useQuery(
  ['fetch-subscriptions', token, params],
  fetcher,
  { ...queryConfig },
);

export default useFetchSubscriptions;
