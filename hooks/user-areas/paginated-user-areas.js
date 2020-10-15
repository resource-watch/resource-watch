import { usePaginatedQuery } from 'react-query';

// services
import { fetchUserAreas } from 'services/areas';

const fetcher = (key, id, params) => fetchUserAreas(id, params);

const useUserArea = (id, ...restProps) => usePaginatedQuery(['paginated-user-areas', id, ...restProps], fetcher, { initialData: [], initialStale: true });

export default useUserArea;
