import { useQuery } from 'react-query';
import { useSession } from 'next-auth/client';

// services
import {
  fetchUser,
} from 'services/user';

const useFetchUser = (userToken, queryConfig) => useQuery(
  'me',
  () => fetchUser(userToken),
  { ...queryConfig },
);

export const useMe = (queryConfig = {}) => {
  const [session] = useSession();

  return useFetchUser(
    [`Bearer ${session?.accessToken}`],
    {
      enabled: !!(session?.accessToken),
      refetchOnWindowFocus: false,
      select: (user) => user && ({
        ...user,
        token: `Bearer ${session?.accessToken}`,
      }),
      ...queryConfig,
    },
  );
};

export default {
  useMe,
};
