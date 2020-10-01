import { useQuery } from 'react-query';

// services
import { fetchDashboard } from 'services/dashboard';

const fetcher = (key, id, params) => fetchDashboard(id, params);

const useFetchDashboard = (id, params = {}, queryConfig = {}) => useQuery(
  ['fetch-dashboard', id, params],
  fetcher,
  { ...queryConfig },
);

export default useFetchDashboard;
