import { usePaginatedQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const fetcher = (key, token, params) => fetchAllCollections(token, params, true);

const usePaginatedCollections = (token, params, queryConfig = {}) => usePaginatedQuery(
  ['paginated-collections', token, params],
  fetcher,
  { ...queryConfig },
);

export default usePaginatedCollections;
