import { useQuery } from 'react-query';

// services
import { fetchSubscriptions } from 'services/subscriptions';

const useFetchSubscriptions = (token, params = {}, queryConfig = {}) => useQuery(
  ['fetch-subscriptions', token, params],
  () => fetchSubscriptions(token, params),
  { ...queryConfig },
);

export default useFetchSubscriptions;
