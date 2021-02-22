import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import SearchInput from 'components/ui/SearchInput';

const SearchMobile = ({
  header,
  setSearchTerm,
}) => {
  const router = useRouter();
  const {
    searchTerm,
  } = header;

  return (
    <form
      className="c-search-mobile"
      onSubmit={(e) => {
        if (e) e.preventDefault();
        router.push({
          pathname: '/search',
          query: {
            term: searchTerm,
          },
        });
        setSearchTerm('');
      }}
    >
      <SearchInput
        input={{
          placeholder: 'Search',
          value: searchTerm,
        }}
        onSearch={setSearchTerm}
      />
    </form>
  );
};

SearchMobile.propTypes = {
  header: PropTypes.shape({
    searchTerm: PropTypes.string,
  }).isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default SearchMobile;
