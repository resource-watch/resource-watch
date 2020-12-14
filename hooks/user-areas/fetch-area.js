import { useQuery } from 'react-query';

// services
import { fetchArea } from 'services/areas';

const fetcher = (key, id, token, params) => fetchArea(id, params, { Authorization: token });

const useFetchArea = (id, token, params = {}, queryConfig = {}) => useQuery(
  ['user-area', id, token, params],
  fetcher,
  { ...queryConfig },
);

export default useFetchArea;
