import { useQuery } from 'react-query';

// service
import {
  fetchDashboard,
  fetchDashboards,
} from 'services/dashboard';

export const useFetchDashboard = (
  id,
  params = {},
  queryConfig = {},
) => useQuery(
  ['fetch-dashboard', id, params],
  () => fetchDashboard(id, params),
  { ...queryConfig },
);

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
