import { useQuery } from 'react-query';

// services
import { fetchWidget } from 'services/widget';

const fetcher = (key, id, params) => fetchWidget(id, params);

const useFetchWidget = (id, params = {}, queryConfig = {}) => useQuery(
  ['fetch-widget', id, params],
  fetcher,
  { ...queryConfig },
);

export default useFetchWidget;
