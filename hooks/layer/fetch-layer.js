import { useQuery } from 'react-query';

// services
import { fetchLayer } from 'services/layer';

// const fetcher = (key, id, params) => fetchLayer(id, params);

const useFetchLayer = (id, params = {}, queryConfig = {}) => useQuery(
  ['fetch-layer', id, params],
  () => fetchLayer(id, params),
  { ...queryConfig },
);

export default useFetchLayer;
