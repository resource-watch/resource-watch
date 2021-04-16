import { useQuery } from 'react-query';

// services
import { fetchFavorites } from 'services/favourites';

const useFetchUserFavorites = (token, queryConfig = {}) => useQuery(
  ['fetch-user-favorites', token],
  () => fetchFavorites(token),
  { ...queryConfig },
);

export default useFetchUserFavorites;
