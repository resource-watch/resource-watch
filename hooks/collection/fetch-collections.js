import { useQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const fetcher = (key, token) => fetchAllCollections(token);

const useFetchCollections = (token, queryConfig = {}) => useQuery(
  ['fetch-collections', token],
  fetcher,
  { ...queryConfig },
);

export default useFetchCollections;
