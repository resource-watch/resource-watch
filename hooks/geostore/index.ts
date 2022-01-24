import { useQuery } from 'react-query';

// services
import { fetchGeostore } from 'services/geostore';

// types
import type { QueryObserverOptions } from 'react-query';
import type { Geostore } from 'types/geostore';

export const useGeostore = (
  id: string,
  params: Record<string, string | number> = {},
  queryConfig: QueryObserverOptions<Geostore | Partial<Geostore>, Error> = {},
) =>
  useQuery<Geostore | Partial<Geostore>, Error>(
    ['geostore', id, params],
    () => fetchGeostore(id, params),
    {
      ...queryConfig,
    },
  );

export default useGeostore;
