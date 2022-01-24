import { useQuery } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const useFetchCollections = (token, params = {}, queryConfig = {}) =>
  useQuery('fetch-collections', () => fetchAllCollections(token, params), { ...queryConfig });

export default useFetchCollections;
