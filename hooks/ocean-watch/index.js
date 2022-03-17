import { useQuery } from 'react-query';

// services
import { fetchOceanWatchAreas } from 'services/ocean-watch';

export const useOceanWatchAreas = (queryConfig = {}) =>
  useQuery(['ocean-watch-areas'], () => fetchOceanWatchAreas(), {
    refetchOnWindowFocus: false,
    placeholderData: [],
    initialStale: true,
    ...queryConfig,
  });

export default {
  useOceanWatchAreas,
};
