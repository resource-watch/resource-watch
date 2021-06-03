import { useQuery } from 'react-query';

// services
import {
  fetchCountryV2,
} from 'services/geostore';

export const useCountryV2 = (
  id,
  params = {},
  queryConfig = {},
) => useQuery(
  ['geostore-country-v2', id, params],
  () => fetchCountryV2(id, params),
  { ...queryConfig },
);

export default useCountryV2;
