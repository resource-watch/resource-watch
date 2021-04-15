import { useQuery } from 'react-query';

// services
import { fetchDashboard } from 'services/dashboard';

const useFetchDashboard = (id, params = {}, queryConfig = {}) => useQuery(
  ['fetch-dashboard', id, params],
  () => fetchDashboard(id, params),
  { ...queryConfig },
);

export default useFetchDashboard;
