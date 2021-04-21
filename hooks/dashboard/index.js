import { useQuery } from 'react-query';

// service
import { fetchDashboards } from 'services/dashboard';

export const useFeaturedDashboards = (
  _params,
  queryConfig = {},
) => {
  const params = {
    published: 'true',
    'is-featured': true,
    ..._params,
  };

  return useQuery(
    ['fetch-featured-dashboards', params],
    () => fetchDashboards(params),
    { ...queryConfig },
  );
};

export default {
  useFeaturedDashboards,
};
