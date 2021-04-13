import { useQuery } from 'react-query';

// services
import { fetchFavourites } from 'services/favourites';

const useFetchUserFavorites = (token, queryConfig = {}) => useQuery(
  ['fetch-user-favorites', token],
  () => fetchFavourites(token),
  { ...queryConfig },
);

export default useFetchUserFavorites;
