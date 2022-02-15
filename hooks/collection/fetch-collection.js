import { useQuery } from 'react-query';

// services
import { fetchCollection } from 'services/collections';

const useFetchCollection = (id, token, params = {}, queryConfig = {}) =>
  useQuery(['fetch-collection', token, id, params], () => fetchCollection(token, id, params), {
    ...queryConfig,
  });

export default useFetchCollection;
