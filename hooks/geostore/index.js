import { useQuery } from 'react-query';

// services
import {
  fetchGeostore,
} from 'services/geostore';

export const useGeostore = (
  id,
  params = {},
  queryConfig = {},
) => useQuery(
  ['geostore', id, params],
  () => fetchGeostore(id, params),
  { ...queryConfig },
);

export default useGeostore;
