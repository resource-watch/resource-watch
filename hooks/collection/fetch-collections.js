import { useQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const useFetchCollections = (token, params = {}, queryConfig = {}) => useQuery(
  ['fetch-collections', token, params],
  () => fetchAllCollections(token, params),
  { ...queryConfig },
);

export default useFetchCollections;
