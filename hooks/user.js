import { useQuery } from 'react-query';

// services
import {
  fetchUser,
} from 'services/user';

const useFetchUser = (userToken, queryConfig) => useQuery(
  ['fetch-user', userToken],
  () => fetchUser(userToken),
  { ...queryConfig },
);

export const useMe = (userToken, queryConfig = {}) => useFetchUser(
  [userToken],
  {
    enabled: !!userToken,
    refetchOnWindowFocus: false,
    initialData: {},
    initialStale: true,
    ...queryConfig,
  },
);

export default useMe;
