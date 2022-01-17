import { useQuery } from 'react-query';

// services
import { fetchWidget } from 'services/widget';

import type { APIWidgetSpec } from 'types/widget';

export const useFetchWidget = (id, params = {}, queryConfig = {}) =>
  useQuery<APIWidgetSpec, Error>(['fetch-widget', id, params], () => fetchWidget(id, params), {
    ...queryConfig,
  });

export default {
  useFetchWidget,
};
