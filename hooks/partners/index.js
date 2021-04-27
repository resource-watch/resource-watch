import { useQuery } from 'react-query';

// service
import {
  fetchPartners,
} from 'services/partners';

export const usePublishedPartners = (
  _params,
  queryConfig = {},
) => {
  const params = {
    published: true,
    ..._params,
  };

  return useQuery(
    ['published-partners', params],
    () => fetchPartners(params),
    { ...queryConfig },
  );
};

export default {
  usePublishedPartners,
};
