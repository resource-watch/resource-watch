import { useQuery } from 'react-query';

// services
import { fetchFavourites } from 'services/favourites';

const fetcher = (key, token) => fetchFavourites(token);

const useGetUserFavorites = (token, queryConfig = {}) => useQuery(
  ['fetch-user-favorites', token],
  fetcher,
  { ...queryConfig },
);

export default useGetUserFavorites;
