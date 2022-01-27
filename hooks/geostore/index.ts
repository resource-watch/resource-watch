import { useQuery } from 'react-query';

// services
import { fetchGeostore } from 'services/geostore';

import type { Geostore } from 'types/geostore';

export const useGeostore = (id, params = {}, queryConfig = {}) =>
  useQuery<Geostore, Error>(['geostore', id, params], () => fetchGeostore(id, params), {
    ...queryConfig,
  });

export default useGeostore;
