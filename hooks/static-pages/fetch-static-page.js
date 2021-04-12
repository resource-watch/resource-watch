import { useQuery } from 'react-query';

// services
import { fetchPage } from 'services/pages';

const useFetchStaticPage = (id, token, queryConfig = {}) => useQuery(
  ['fetch-static-page', id, token],
  () => fetchPage(id, token),
  { ...queryConfig },
);

export default useFetchStaticPage;
