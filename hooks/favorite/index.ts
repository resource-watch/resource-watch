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

// utils
import { logEvent } from 'utils/analytics';

// types
import type { Favorite } from 'types/favorite';

export interface NewFavorite {
  favorite: Pick<Favorite, 'resourceId' | 'resourceType'>;
}

export interface DeleteFavorite {
  favoriteId: string;
}

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
      onMutate: () => {
        const previousFavorites = queryClient.getQueryData<Favorite[]>('fetch-user-favorites');

        return { previousFavorites };
      },
      onSuccess: async (data, variables) => {
        logEvent(
          'Favorites',
          `user favorites ${variables.favorite.resourceType} "${variables.favorite.resourceId}"`,
        );
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
      onMutate: () => {
        const previousFavorites = queryClient.getQueryData<Favorite[]>('fetch-user-favorites');

        return { previousFavorites };
      },
      onSuccess: async (data, variables) => {
        logEvent('Favorites', `user removes from favorites ${variables.favoriteId}`);
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

export const useFetchUserFavorites = (
  token: string,
  queryConfig: QueryObserverOptions<Favorite[], Error> = {},
) =>
  useQuery<Favorite[], Error>('fetch-user-favorites', () => fetchFavorites(token), {
    ...queryConfig,
  });
