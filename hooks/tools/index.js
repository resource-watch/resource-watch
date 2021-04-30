import { useQuery } from 'react-query';

// service
import {
  fetchTool,
} from 'services/tools';

export const useFetchTool = (
  id,
  token,
  params = {},
  queryConfig = {},
) => useQuery(
  ['fetch-tool', id, token, params],
  () => fetchTool(id, token, params),
  { ...queryConfig },
);

export default {
  useFetchTool,
};
