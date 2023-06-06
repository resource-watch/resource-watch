import {
  useMutation,
  useQuery,
  useQueryClient,
  MutationObserverOptions,
  QueryObserverOptions,
} from 'react-query';

// hooks
import { useMe } from 'hooks/user';

// services
import { fetchFavorites, deleteFavourite, createFavourite } from 'services/favourites';

// types
import type { Favorite } from 'types/favorite';

export interface NewFavorite {
  favorite: Pick<Favorite, 'resourceId' | 'resourceType'>;
}

export interface DeleteFavorite {
  favoriteId: string;
}

export const useFetchUserFavorites = <D>(
  token: string,
  queryConfig: QueryObserverOptions<Favorite[], Error, D> = {},
) =>
  useQuery('fetch-user-favorites', () => fetchFavorites(token), {
    ...queryConfig,
  });

export const useIsFavorite = (id: string, token: string) => {
  const queryClient = useQueryClient();

  return useFetchUserFavorites<Favorite>(token, {
    enabled: Boolean(token),
    refetchOnWindowFocus: false,
    placeholderData: queryClient.getQueryData('fetch-user-favorites') || [],
    select: (userFavorites) => userFavorites.find(({ resourceId }) => id === resourceId),
  });
};

const addFavorite = ({
  token,
  favorite,
}: {
  token: string;
  favorite: Pick<Favorite, 'resourceId' | 'resourceType'>;
}) => createFavourite(token, favorite);

const removeFavorite = ({ token, favoriteId }: { token: string; favoriteId: string }) =>
  deleteFavourite(token, favoriteId);

export const useSaveFavorite = (
  queryConfig: MutationObserverOptions<Favorite, Error, NewFavorite> = {},
) => {
  const { data: user } = useMe();
  const queryClient = useQueryClient();

  return useMutation<Favorite, Error, NewFavorite>(
    ({ favorite }) => addFavorite({ token: user.token, favorite }),
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries('fetch-user-favorites');

        queryClient.setQueryData<Favorite[]>('fetch-user-favorites', (prevFavorites) => [
          ...prevFavorites,
          { ...data.favorite } as Favorite,
        ]);

        return { data };
      },
      onError: async (error, data, context: { previousFavorites: Favorite[] }) => {
        queryClient.setQueryData('fetch-user-favorites', context.previousFavorites);
        throw new Error(
          `Error adding favorite with id "${data.favorite.resourceId}": ${error.message}`,
        );
      },
      onSettled: async () => {
        await queryClient.invalidateQueries('fetch-user-favorites');
      },
      ...queryConfig,
    },
  );
};

export const useDeleteFavorite = (
  queryConfig: MutationObserverOptions<Favorite, Error, DeleteFavorite> = {},
) => {
  const { data: user } = useMe();
  const queryClient = useQueryClient();

  return useMutation<Favorite, Error, DeleteFavorite>(
    ({ favoriteId }) => removeFavorite({ token: user.token, favoriteId }),
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries('fetch-user-favorites');

        queryClient.setQueryData<Favorite[]>('fetch-user-favorites', (prevFavorites) => [
          ...prevFavorites.filter(({ id }) => id !== data.favoriteId),
        ]);

        return { data };
      },
      onError: async (error, data, context: { previousFavorites: Favorite[] }) => {
        queryClient.setQueryData('fetch-user-favorites', context.previousFavorites);
        throw new Error(`Error deleting favorite with id "${data.favoriteId}": ${error.message}`);
      },
      onSettled: async () => {
        await queryClient.invalidateQueries('fetch-user-favorites');
      },
      ...queryConfig,
    },
  );
};
