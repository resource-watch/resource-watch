/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setSearchPage, setSearchUrl, setSearchTerm, fetchSearch } from 'redactions/search';

import SearchComponent from './search-component';

class SearchPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    term: PropTypes.string,
    page: PropTypes.number
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { term, page } = props.url.query;

    if (page) {
      context.store.dispatch(setSearchPage(page));
    }

    if (term) {
      context.store.dispatch(setSearchTerm(term));
      await context.store.dispatch(fetchSearch());
    }

    return { ...props };
  }

  componentWillReceiveProps(nextProps) {
    const { term: newTerm, page: newPage } = nextProps;
    const { term: oldTerm, page: oldPage } = this.props;

    if (
      newTerm !== oldTerm ||
      newPage !== oldPage
    ) {
      window.scrollTo(0, 0);
      fetchSearch();
    }
  }

  render() {
    return <SearchComponent />;
  }
}

const mapDispatchToProps = {
  setSearchPage,
  setSearchUrl,
  setSearchTerm,
  fetchSearch
};

export default withRedux(
  initStore,
  state => ({
    ...state.search
  }),
  mapDispatchToProps
)(SearchPage);
