import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import SearchInput from 'components/ui/SearchInput';

class SearchMobile extends PureComponent {
  static propTypes = {
    header: PropTypes.object.isRequired,
    setSearchTerm: PropTypes.func.isRequired
  }

  render() {
    const {
      header: { searchTerm },
      setSearchTerm
    } = this.props;

    return (
      <form
        className="c-search-mobile"
        onSubmit={(e) => {
          if (e) e.preventDefault();
          Router.pushRoute('search', { term: searchTerm });
          setSearchTerm('');
        }}
      >
        <SearchInput
          input={{
            placeholder: 'Search',
            value: searchTerm
          }}
          onSearch={setSearchTerm}
        />
      </form>
    );
  }
}

export default SearchMobile;
