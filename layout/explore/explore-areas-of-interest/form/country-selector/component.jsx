import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

// components
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';

// services
import { fetchCountries } from 'services/geostore';

// styles
import './styles.scss';

const fetcher = () => fetchCountries()
  .then((data) => data
    .filter(({ name }) => !!name)
    .map(({ name, geostoreId }) => ({
      name,
      geostoreId,
    })));

const CountrySelector = ({ onClickCountry }) => {
  const [search, setSearch] = useState('');
  const handleSearch = useCallback((_search) => { setSearch(_search); }, [setSearch]);
  const handleCountry = useCallback(({ target }) => {
    const { dataset: { geostore } } = target;
    onClickCountry(geostore);
  }, [onClickCountry]);
  const {
    data,
    isFetching,
    isSuccess,
  } = useQuery(['country-list-fetch'], fetcher, {
    initialData: [],
    initialStale: true,
  });
  const results = useMemo(() => data
    .filter(({ name }) => name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
  [data, search]);

  return (
    <div className="c-country-selector">
      <div className="search-container">
        <SearchInput
          input={{
            value: search,
            placeholder: 'Type a country',
          }}
          onSearch={handleSearch}
        />
      </div>
      <div className="countries-container">
        {isFetching && (
          <Spinner
            isLoading
            className="-small -transparent"
          />
        )}
        {isSuccess && (
          <ul className="country-list">
            {results.map(({ name, geostoreId }) => (
              <li
                key={geostoreId}
                className="country-list-item"
              >
                <button
                  type="button"
                  onClick={handleCountry}
                  data-geostore={geostoreId}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

CountrySelector.propTypes = {
  onClickCountry: PropTypes.func.isRequired,
};

export default CountrySelector;
