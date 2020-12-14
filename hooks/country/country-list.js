import { useQuery } from 'react-query';

// services
import { fetchCountries } from 'services/geostore';

const fetcher = () => fetchCountries()
  .then((data) => data
    .filter(({ name }) => !!name)
    .sort((_a, _b) => {
      if (_a.name > _b.name) return 1;
      if (_a.name < _b.name) return -1;
      return 0;
    })
    .map(({ name, geostoreId }) => ({
      name,
      geostoreId,
    })));

const useCountryList = (queryProps) => useQuery(
  ['fetch-countries'],
  fetcher,
  {
    initialData: [],
    initialStale: true,
    ...queryProps,
  },
);

export default useCountryList;
