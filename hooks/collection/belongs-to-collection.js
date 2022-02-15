import { useMemo, useCallback } from 'react';
import { useQueryClient } from 'react-query';

// hooks
import { useFetchUserFavorites } from 'hooks/favorite';
import useFetchCollections from 'hooks/collection/fetch-collections';

const useBelongsToCollection = (resourceId, token) => {
  const queryClient = useQueryClient();
  const { data: userFavorites, refetch: refetchFavorites } = useFetchUserFavorites([token], {
    enabled: !!token,
    refetchOnWindowFocus: false,
    initialData: [],
  });

  const { data: collections, refetch: refetchCollections } = useFetchCollections(
    token,
    {
      sort: 'name',
    },
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      initialData: queryClient.getQueryData('fetch-collections') || [],
    },
  );

  const refetch = useCallback(() => {
    refetchFavorites();
    refetchCollections();
  }, [refetchFavorites, refetchCollections]);

  const isInACollection = useMemo(() => {
    const containedInFavorites = userFavorites.some((fav) => fav.resourceId === resourceId);
    const containedInCollections = collections.some(({ resources }) =>
      resources.some(({ id }) => id === resourceId),
    );

    return containedInFavorites || containedInCollections;
  }, [userFavorites, collections, resourceId]);

  return {
    isInACollection,
    refetch,
  };
};

export default useBelongsToCollection;
