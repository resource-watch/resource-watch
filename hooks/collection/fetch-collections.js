import { useQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const fetcher = (key, params, token) => fetchAllCollections(token, params);

const useFetchCollections = (token, params = {}, queryConfig = {}) => useQuery(
  ['fetch-collections', params, token],
  fetcher,
  { ...queryConfig },
);

export default useFetchCollections;
