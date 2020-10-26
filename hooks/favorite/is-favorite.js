import { useMemo } from 'react';

// hooks
import useGetUserFavorites from 'hooks/favorite/get-favorites';

const useIsFavorite = (id, token) => {
  const {
    data: userFavorites,
    refetch,
  } = useGetUserFavorites(
    [token],
    {
      enabled: token,
      refetchOnWindowFocus: false,
      initialData: [],
      initialStale: true,
    },
  );

  const favorite = useMemo(
    () => userFavorites.find(({ resourceId }) => id === resourceId),
    [userFavorites, id],
  );

  return ({
    isFavorite: !!favorite,
    data: favorite,
    refetch,
  });
};

export default useIsFavorite;
