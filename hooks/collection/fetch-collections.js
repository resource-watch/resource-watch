import { useQuery, useQueryClient } from 'react-query';

// services
import { fetchAllCollections } from 'services/collections';

const useFetchCollections = (token, params = {}, queryConfig = {}) => {
  const queryClient = useQueryClient();

  return useQuery('fetch-collections', () => fetchAllCollections(token, params), {
    ...queryConfig,
    placeholderData: queryClient.getQueryData('fetch-collections') || [],
  });
};

export default useFetchCollections;
