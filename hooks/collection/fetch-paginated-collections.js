import { useQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const usePaginatedCollections = (token, params, queryConfig = {}) => useQuery(
  ['paginated-collections', token, params],
  () => fetchAllCollections(token, params, true),
  { ...queryConfig },
);

export default usePaginatedCollections;
