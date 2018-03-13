/* eslint max-len: 0 */
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import SearchInput from 'components/ui/SearchInput';
import Icon from 'components/ui/Icon';

import selectedSearchItem from 'selectors/search/selected';

import { setSearchOpened } from 'layout/header/header-actions';
import { setSearchPage, setSearchUrl, setSearchTerm, fetchSearch, setSearchSelected } from './actions';

class SearchTerm extends React.PureComponent {
  static propTypes = {
    search: PropTypes.shape({
      term: PropTypes.string,
      selected: PropTypes.number,
      list: PropTypes.array
    }),
    header: PropTypes.shape({
      searchOpened: PropTypes
    }),
    isHeader: PropTypes.bool,
    selected: PropTypes.object,
    // ACTIONS
    setSearchPage: PropTypes.func,
    setSearchTerm: PropTypes.func,
    setSearchUrl: PropTypes.func,
    fetchSearch: PropTypes.func,
    setSearchOpened: PropTypes.func,
    setSearchSelected: PropTypes.func
  }

  componentDidUpdate() {
    const { header } = this.props;
    if (header.searchOpened) {
      // If we don't wait until animation is over it won't focus
      // If we only animate opcity it won't make the leave animation
      setTimeout(() => {
        this.input.focus();

        // Prevent body scroll
        document.documentElement.classList.add('-no-scroll');
        document.body.classList.add('-no-scroll');
      }, 160);
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

  onKeyDown(e) {
    const { key } = e;
    const { search, selected } = this.props;

    const keyTargets = /Arrow(Up|Down)|Enter/.test(key);

    if (keyTargets) {
      e.preventDefault();
    }

    if (key === 'ArrowDown') {
      if (search.list.length !== search.selected) {
        this.props.setSearchSelected(search.selected + 1);
      } else {
        this.props.setSearchSelected(1);
      }
    } else if (key === 'ArrowUp') {
      if (search.selected !== 1) {
        this.props.setSearchSelected(search.selected - 1);
      } else {
        this.props.setSearchSelected(search.list.length);
      }
    } else if (key === 'Enter' && selected) {
      window.location = selected.url;
    }

    if (!keyTargets && search.selected) {
      this.props.setSearchSelected(null);
    }
  }

  setSearchOpened(opened) {
    if (!opened) {
      document.documentElement.classList.remove('-no-scroll');
      document.body.classList.remove('-no-scroll');
      this.props.setSearchTerm('');
      this.props.fetchSearch();
    }
    this.props.setSearchOpened(opened);
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
          onKeyDown={e => this.onKeyDown(e)}
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
  selected: selectedSearchItem(state),
  header: state.header
});

const mapDispatchToProps = dispatch => ({
  setSearchPage: page => dispatch(setSearchPage(page)),
  setSearchUrl: url => dispatch(setSearchUrl(url)),
  setSearchTerm: term => dispatch(setSearchTerm(term)),
  fetchSearch: () => dispatch(fetchSearch()),
  setSearchOpened: b => dispatch(setSearchOpened(b)),
  setSearchSelected: n => dispatch(setSearchSelected(n))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchTerm);
