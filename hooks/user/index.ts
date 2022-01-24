import { useQuery, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';

// services
import { fetchUser, fetchUserData } from 'services/user';

import type { QueryObserverOptions } from 'react-query';
import type { User, UserData, UserWithToken } from 'types/user';

const useFetchUser = (
  userToken: string,
  queryConfig?: QueryObserverOptions<User, Error, UserWithToken>,
) => useQuery<User, Error, UserWithToken>('me', () => fetchUser(userToken), queryConfig);

export const useMe = (queryConfig?: QueryObserverOptions<User, Error, UserWithToken>) => {
  const [session] = useSession();

  return useFetchUser(`Bearer ${session?.accessToken}`, {
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
    select: (user): UserWithToken =>
      user && {
        ...user,
        token: `Bearer ${session?.accessToken}`,
      },
    ...queryConfig,
  });
};

export const useFetchUserData = (queryConfig?: QueryObserverOptions<UserData, Error>) => {
  const queryClient = useQueryClient();
  const { data: user } = useMe();

  return useQuery<UserData, Error>('user-data', () => fetchUserData(user.token), {
    enabled: Boolean(user?.token),
    refetchOnWindowFocus: false,
    placeholderData: queryClient.getQueryData('user-data') || null,
    ...queryConfig,
  });
};
