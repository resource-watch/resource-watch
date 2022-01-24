import { useMemo } from 'react';

// hooks
import { useFetchUserFavorites } from 'hooks/favorite';

const useIsFavorite = (id, token) => {
  const { data: userFavorites, ...fetcherProps } = useFetchUserFavorites(token, {
    enabled: !!token,
    refetchOnWindowFocus: false,
    placeholderData: [],
  });

  const favorite = useMemo(
    () => userFavorites.find(({ resourceId }) => id === resourceId),
    [userFavorites, id],
  );

  return {
    isFavorite: !!favorite,
    data: favorite,
    ...fetcherProps,
  };
};

export default useIsFavorite;
