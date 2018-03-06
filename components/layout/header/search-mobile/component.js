import React from 'react';
import PropTypes from 'prop-types';

// Next
import { Router } from 'routes';

// Components
import SearchInput from 'components/ui/SearchInput';

export default class SearchMobileComponent extends React.PureComponent {
  static propTypes = {
    header: PropTypes.object,

    // Actions
    setSearchTerm: PropTypes.func
  }

  render() {
    const {
      header
    } = this.props;

    return (
      <form
        className="c-search-mobile"
        onSubmit={(e) => {
          e && e.preventDefault();
          Router.pushRoute('search', { term: header.searchTerm });
          this.props.setSearchTerm('');
        }}
      >
        <SearchInput
          input={{
            placeholder: 'Search',
            value: header.searchTerm
          }}
          onSearch={this.props.setSearchTerm}
        />
      </form>
    );
  }
}
