import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';

// Components
import Icon from 'components/ui/Icon';
import SearchResults from 'components/search/search-results';
import Spinner from 'components/ui/Spinner';

import { fetchSearch, setSearchTerm } from 'redactions/search';

import * as actions from '../header-actions';

class Search extends React.Component {
  componentDidUpdate() {
    if (this.props.header.searchOpened) {
      // If we don't wait until animation is over it won't focus
      // If we only animate opcity it won't make the leave animation
      setTimeout(() => {
        this.input.focus();

        // Prevent body scroll
        document.documentElement.classList.add('-no-scroll');
        document.body.classList.add('-no-scroll');
      }, 160);
    } else {
      this.input.value = '';
      this.input.blur();

      // Allow body scroll
      document.documentElement.classList.remove('-no-scroll');
      document.body.classList.remove('-no-scroll');
    }
  }

  onSearch = debounce((term) => {
    this.props.setSearchTerm(term);
    this.props.fetchSearch();
  })

  getInputRef = (c) => {
    this.input = c;
  }

  render() {
    const classNames = classnames({
      '-opened': this.props.header.searchOpened
    });

    return (
      <div className={`c-search ${classNames}`}>
        <div className="search-container">

          <form
            className="search-form"
            noValidate
          >
            <Icon name="icon-search" className="search-icon -medium" />

            <input
              ref={this.getInputRef}
              value={this.props.search.term}
              onChange={e => this.onSearch(e.target.value)}
              className="search-input"
              type="text"
              placeholder="Search in Resource Watch"
            />

            <button
              className="search-close"
              type="button"
              onClick={() => this.props.setSearchOpened(false)}
            >
              <Icon name="icon-cross" className="-smaller" />
            </button>
          </form>
          {this.props.search.loading && <Spinner isLoading className="-light" />}

          <SearchResults hideSearchInput headerSearch />
        </div>

        <button
          onClick={() => this.props.setSearchOpened(false)}
          className="search-backdrop"
        />
      </div>
    );
  }
}

Search.propTypes = {
  header: PropTypes.object,
  // ACTIONS
  setSearchOpened: PropTypes.func,
  setSearchTerm: PropTypes.func,
  fetchSearch: PropTypes.func
};

const mapStateToProps = state => ({
  header: state.header,
  search: state.search
});

const mapDispatchToProps = dispatch => ({
  setSearchOpened: opened => dispatch(actions.setSearchOpened(opened)),
  fetchSearch: () => dispatch(fetchSearch()),
  setSearchTerm: term => dispatch(setSearchTerm(term))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);

