import { useQuery } from 'react-query';

// services
import { fetchUserAreas } from 'services/areas';

const usePaginatedUserAreas = (token, params) => useQuery(
  ['paginated-user-areas', token, params],
  () => fetchUserAreas(token, params, true),
  {
    initialData: {
      areas: [],
      meta: {},
    },
    initialStale: true,
    keepPreviousData: true,
  },
);

export default usePaginatedUserAreas;
