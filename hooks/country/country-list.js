import { useQuery } from 'react-query';

// services
import { fetchCountries } from 'services/geostore';

const fetcher = () => fetchCountries()
  .then((data) => data
    .filter(({ name }) => !!name)
    .map(({ name, geostoreId }) => ({
      name,
      geostoreId,
    })));

const useCountries = (queryProps) => useQuery(
  ['countries'],
  fetcher,
  {
    initialData: [],
    initialStale: true,
    ...queryProps,
  },
);

export default useCountries;
