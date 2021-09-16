import { useQuery } from 'react-query';

// service
import {
  fetchPartner,
  fetchPartners,
} from 'services/partners';

export const useFetchPartner = (
  id,
  params = {},
  queryConfig = {},
) => useQuery(
  ['fetch-partner', id, params],
  () => fetchPartner(id, params),
  { ...queryConfig },
);

export const usePublishedPartners = (
  _params,
  queryConfig = {},
) => {
  const params = {
    published: true,
    env: process.env.NEXT_PUBLIC_ENVS_SHOW,
    ..._params,
  };

  return useQuery(
    ['published-partners', params],
    () => fetchPartners(params),
    { ...queryConfig },
  );
};
