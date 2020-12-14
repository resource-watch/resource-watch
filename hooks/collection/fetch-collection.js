import { useQuery } from 'react-query';

// services
import { fetchCollection } from 'services/collections';

const fetcher = (key, token, id, params) => fetchCollection(token, id, params);

const useFetchCollection = (id, token, params = {}, queryConfig = {}) => useQuery(
  ['fetch-collection', token, id, params],
  fetcher,
  { ...queryConfig },
);

export default useFetchCollection;
