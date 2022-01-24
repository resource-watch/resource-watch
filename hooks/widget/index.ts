import { useQuery } from 'react-query';

// services
import { fetchWidget } from 'services/widget';

import type { QueryObserverOptions } from 'react-query';
import type { APIWidgetSpec } from 'types/widget';

export const useFetchWidget = (
  id: string,
  params: Record<string, string | number> = {},
  queryConfig: QueryObserverOptions<APIWidgetSpec | Partial<APIWidgetSpec>, Error> = {},
) =>
  useQuery<APIWidgetSpec | Partial<APIWidgetSpec>, Error>(
    ['fetch-widget', id, params],
    () => fetchWidget(id, params),
    {
      ...queryConfig,
    },
  );

export default {
  useFetchWidget,
};
