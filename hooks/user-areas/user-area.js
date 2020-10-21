import { useQuery } from 'react-query';

// services
import { fetchArea } from 'services/areas';

const fetcher = (key, id, token, params) => fetchArea(id, params, { Authorization: token });

const useUserArea = (id, token, ...restProps) => useQuery(['user-area', id, token, ...restProps], fetcher, { cacheTime: 0 });

export default useUserArea;
