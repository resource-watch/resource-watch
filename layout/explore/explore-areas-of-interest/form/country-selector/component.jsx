import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// components
import SearchInput from 'components/ui/SearchInput';
import Spinner from 'components/ui/Spinner';

// hooks
import useCountries from 'hooks/country/country-list';

// styles
import './styles.scss';

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
  } = useCountries();

  const countryList = useMemo(() => data
    .filter(({ name }) => !!name)
    .map(({ name, geostoreId }) => ({
      name,
      geostoreId,
    })),
  [data]);

  const results = useMemo(() => countryList
    .filter(({ name }) => name.toLocaleLowerCase().includes(search.toLocaleLowerCase())),
  [countryList, search]);

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
