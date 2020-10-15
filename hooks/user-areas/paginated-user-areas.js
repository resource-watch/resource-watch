import { usePaginatedQuery } from 'react-query';

// services
import { fetchUserAreas } from 'services/areas';

const fetcher = (key, token, params) => fetchUserAreas(token, params, true);

const usePaginatedUserAreas = (token, params) => usePaginatedQuery(
  ['paginated-user-areas', token, params],
  fetcher,
  {
    initialData: {
      areas: [],
      meta: {},
    },
    initialStale: true,
  },
);

export default usePaginatedUserAreas;
