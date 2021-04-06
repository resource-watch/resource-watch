import { useQuery } from 'react-query';

// services
import { fetchPage } from 'services/pages';

const fetcher = (key, id, token) => fetchPage(id, token);

const useFetchStaticPage = (id, token, queryConfig = {}) => useQuery(
  ['fetch-static-page', id, token],
  fetcher,
  { ...queryConfig },
);

export default useFetchStaticPage;
