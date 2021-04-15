import { useQuery } from 'react-query';

// services
import { fetchArea } from 'services/areas';

const useFetchArea = (id, token, params = {}, queryConfig = {}) => useQuery(
  ['user-area', id, token, params],
  () => fetchArea(id, params, { Authorization: token }),
  { ...queryConfig },
);

export default useFetchArea;
