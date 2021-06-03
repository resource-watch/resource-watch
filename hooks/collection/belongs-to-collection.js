import {
  useMemo,
  useCallback,
} from 'react';

// hooks
import useFetchUserFavorites from 'hooks/favorite/fetch-favorites';
import useFetchCollections from 'hooks/collection/fetch-collections';

const useBelongsToCollection = (resourceId, token) => {
  const {
    data: userFavorites,
    refetch: refetchFavorites,
  } = useFetchUserFavorites(
    [token],
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      initialData: [],
      initialStale: true,
    },
  );

  const {
    data: collections,
    refetch: refetchCollections,
  } = useFetchCollections(
    token,
    {},
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      initialData: [],
      initialStale: true,
    },
  );

  const refetch = useCallback(() => {
    refetchFavorites();
    refetchCollections();
  }, [refetchFavorites, refetchCollections]);

  const isInACollection = useMemo(() => {
    const containedInFavorites = userFavorites.some((fav) => fav.resourceId === resourceId);
    const containedInCollections = collections
      .some(({ resources }) => resources
        .some(({ id }) => id === resourceId));

    return (containedInFavorites || containedInCollections);
  }, [userFavorites, collections, resourceId]);

  return ({
    isInACollection,
    refetch,
  });
};

export default useBelongsToCollection;
