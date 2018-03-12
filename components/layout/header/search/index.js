import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { connect } from 'react-redux';

// Components
import Icon from 'components/ui/Icon';
import SearchResults from 'components/search/search-results';
import SearchTerm from 'components/search/search-term';

import Spinner from 'components/ui/Spinner';

import * as actions from '../header-actions';

class Search extends React.Component {
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
            <SearchTerm isHeader />

          </form>

          {this.props.search.loading && <Spinner isLoading className="-light" />}

          <SearchResults headerSearch />
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
  setSearchOpened: PropTypes.func
};

const mapStateToProps = state => ({
  header: state.header,
  search: state.search
});

const mapDispatchToProps = dispatch => ({
  setSearchOpened: opened => dispatch(actions.setSearchOpened(opened))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);

