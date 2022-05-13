import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

// hooks
import { useFetchUserFavorites } from 'hooks/favorite';
import useFetchCollections from 'hooks/collection/fetch-collections';

const useBelongsToCollection = (resourceId, token) => {
  const queryClient = useQueryClient();
  const { data: userFavorites, refetch: refetchFavorites } = useFetchUserFavorites([token], {
    enabled: !!token,
    refetchOnWindowFocus: false,
    placeholderData: queryClient.getQueryData('fetch-user-favorites') || [],
  });

  const { data: collections, refetch: refetchCollections } = useFetchCollections(
    token,
    {
      sort: 'name',
    },
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
    },
  );

  const refetch = useCallback(() => {
    refetchFavorites();
    refetchCollections();
  }, [refetchFavorites, refetchCollections]);

  const containedInFavorites = userFavorites.some((fav) => fav.resourceId === resourceId);
  const containedInCollections = collections.some(({ resources }) =>
    resources.some(({ id }) => id === resourceId),
  );

  const isInACollection = containedInFavorites || containedInCollections;

  return {
    isInACollection,
    refetch,
  };
};

export default useBelongsToCollection;
