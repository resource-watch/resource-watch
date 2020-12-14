import { useQuery } from 'react-query';

// services
import { fetchDatasets } from 'services/dataset';

const fetcher = (key, params) => fetchDatasets(params);

const useFetchDatasets = (params = {}, queryConfig = {}) => useQuery(
  ['fetch-datasets', params],
  fetcher,
  { ...queryConfig },
);

export default useFetchDatasets;
