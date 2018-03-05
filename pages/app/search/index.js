/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/app/search/search-actions';
import Search from 'pages/app/search/search';

class SearchPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    term: PropTypes.string,
    page: PropTypes.number
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    if (props.url.query.term) {
      context.store.dispatch(actions.setSearchTerm(props.url.query.term));

      await context.store.dispatch(actions.fetchSearch());
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
      this.props.fetchSearch();
    }
  }

  render() {
    return <Search />;
  }
}

export default withRedux(
  initStore,
  state => ({
    ...state.search
  }),
  actions
)(SearchPage);
