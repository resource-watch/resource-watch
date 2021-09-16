import {
  useMutation,
  useQueryClient,
} from 'react-query';

// hooks
import {
  useMe,
} from 'hooks/user';

// services
import {
  deleteFavourite,
  createFavourite,
} from 'services/favourites';

// utils
import { logger } from 'utils/logs';

export const useSaveFavorite = (queryConfig = {}) => {
  const {
    data: user,
  } = useMe();
  const queryClient = useQueryClient();

  const handleFavorite = async (favoriteOptions) => {
    await createFavourite(user?.token, favoriteOptions);
  };

  return useMutation(handleFavorite, ({
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-user-favorites');
    },
    onError: (error, favoriteOptions) => {
      logger.error(`Error creating favorite for resource ${favoriteOptions.id}: ${error.message}`);
    },
    ...queryConfig,
  }));
};

export const useDeleteFavorite = (queryConfig = {}) => {
  const {
    data: user,
  } = useMe();
  const queryClient = useQueryClient();

  const handleFavorite = async (favoriteId) => { await deleteFavourite(user?.token, favoriteId); };

  return useMutation(handleFavorite, ({
    onSuccess: () => {
      queryClient.invalidateQueries('fetch-user-favorites');
    },
    onError: (error, favoriteId) => {
      logger.error(`Error deleting favorite with id ${favoriteId}: ${error.message}`);
    },
    ...queryConfig,
  }));
};
