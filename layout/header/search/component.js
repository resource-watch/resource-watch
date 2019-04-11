import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import SearchBar from 'components/search-bar';
import SearchResults from 'components/search-results';
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';

class HeaderSearch extends PureComponent {
  static propTypes = {
    search: PropTypes.shape({ loading: PropTypes.bool }).isRequired,
    header: PropTypes.object.isRequired,
    setSearchOpened: PropTypes.func.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    fetchSearch: PropTypes.func.isRequired
  }

  closeSearch() {
    document.documentElement.classList.remove('-no-scroll');
    document.body.classList.remove('-no-scroll');

    this.props.setSearchOpened(false);
    this.props.setSearchTerm('');
    this.props.fetchSearch();
  }

  render() {
    const {
      header: { searchOpened },
      search: { loading }
    } = this.props;
    const searchClass = classnames(
      'c-search',
      { '-opened': searchOpened }
    );

    return (
      <div className={searchClass}>
        <div className="search-container">
          <form
            className="search-form"
            noValidate
          >
            <Icon
              name="icon-search"
              className="search-icon -medium"
            />
            <SearchBar isHeader />
          </form>

          {loading && (<Spinner isLoading className="-light" />)}

          <SearchResults headerSearch />
        </div>

        <button
          onClick={() => this.closeSearch()}
          className="search-backdrop"
        />
      </div>
    );
  }
}

export default HeaderSearch;

