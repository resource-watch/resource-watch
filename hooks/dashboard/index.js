import { useQuery } from 'react-query';

// service
import { fetchDashboards } from 'services/dashboard';

export const useFeaturedDashboards = (
  _params,
  queryConfig = {},
) => {
  const params = {
    published: true,
    'is-featured': true,
    ..._params,
  };

  return useQuery(
    ['featured-dashboards', params],
    () => fetchDashboards(params),
    { ...queryConfig },
  );
};

export const useHighlightedDashboards = (
  _params,
  queryConfig = {},
) => {
  const params = {
    published: 'true',
    'is-highlighted': true,
    ..._params,
  };

  return useQuery(
    ['highlighted-dashboards', params],
    () => fetchDashboards(params),
    { ...queryConfig },
  );
};
