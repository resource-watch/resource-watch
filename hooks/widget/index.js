import { useQuery } from 'react-query';

// services
import { fetchWidget } from 'services/widget';

export const useFetchWidget = (id, params = {}, queryConfig = {}) =>
  useQuery(['fetch-widget', id, params], () => fetchWidget(id, params), { ...queryConfig });

export default {
  useFetchWidget,
};
