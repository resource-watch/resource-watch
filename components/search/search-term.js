/* eslint max-len: 0 */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import SearchInput from 'components/ui/SearchInput';
import Icon from 'components/ui/Icon';

import { setSearchOpened } from 'components/layout/header/header-actions';
import { setSearchPage, setSearchUrl, setSearchTerm, fetchSearch } from './actions';


class SearchTerm extends React.PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      term: PropTypes.string
    }),
    header: PropTypes.shape({
      searchOpened: PropTypes
    }),
    isHeader: PropTypes.bool,
    // ACTIONS
    setSearchPage: PropTypes.func,
    setSearchTerm: PropTypes.func,
    setSearchUrl: PropTypes.func,
    fetchSearch: PropTypes.func,
    setSearchOpened: PropTypes.func
  }

  componentDidUpdate() {
    const { header, search } = this.props;
    if (header.searchOpened) {
      // If we don't wait until animation is over it won't focus
      // If we only animate opcity it won't make the leave animation
      setTimeout(() => {
        this.input.focus();

        // Prevent body scroll
        document.documentElement.classList.add('-no-scroll');
        document.body.classList.add('-no-scroll');
      }, 160);
    } else {
      if (search.term.length > 0) {
        this.props.setSearchTerm('');
        this.props.fetchSearch();
      }

      this.input.blur();

      // Allow body scroll
      document.documentElement.classList.remove('-no-scroll');
      document.body.classList.remove('-no-scroll');
    }
  }

  onSearch = debounce((term) => {
    const { isHeader } = this.props;
    if (!isHeader) {
      this.props.setSearchPage(1);
      this.props.setSearchTerm(term);
      this.props.setSearchUrl();
    } else {
      this.props.setSearchTerm(term);
      this.props.fetchSearch();
    }
  }, 500)

  setSearchOpened(bool) {
    this.props.setSearchOpened(bool);
  }

  getInputRef = (c) => {
    this.input = c;
  }

  render() {
    const {
      term
    } = this.props.search;

    const { isHeader } = this.props;

    return (
      <div className="c-search--term">
        <SearchInput
          isHeader={isHeader}
          getRef={this.getInputRef}
          input={{
            placeholder: 'Search term',
            value: term
          }}
          onSearch={this.onSearch}
        />

        {isHeader &&
          <button
            className="search-close"
            type="button"
            onClick={() => this.setSearchOpened(false)}
          >
            <Icon name="icon-cross" className="-smaller" />
          </button>
        }

      </div>
    );
  }
}

const mapStateToProps = state => ({
  search: state.search,
  header: state.header
});

const mapDispatchToProps = dispatch => ({
  setSearchPage: page => dispatch(setSearchPage(page)),
  setSearchUrl: url => dispatch(setSearchUrl(url)),
  setSearchTerm: term => dispatch(setSearchTerm(term)),
  fetchSearch: () => dispatch(fetchSearch()),
  setSearchOpened: b => dispatch(setSearchOpened(b))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchTerm);
