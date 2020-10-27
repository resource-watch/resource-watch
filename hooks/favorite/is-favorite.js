import { useMemo } from 'react';

// hooks
import useFetchUserFavorites from 'hooks/favorite/fetch-favorites';

const useIsFavorite = (id, token) => {
  const {
    data: userFavorites,
    refetch,
  } = useFetchUserFavorites(
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
