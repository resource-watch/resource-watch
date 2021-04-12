import { useQuery } from 'react-query';

// services
import { fetchDatasets } from 'services/dataset';

// const fetcher = (key, params) => fetchDatasets(params);

export const useFetchDatasets = (params = {}, queryConfig = {}) => useQuery(
  ['fetch-datasets', params],
  () => fetchDatasets(params),
  { ...queryConfig },
);

export default useFetchDatasets;
