/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/explore/explore-actions';
import Explore from 'layout/explore';

class ExplorePage extends Page {
  static propTypes = {
    explore: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;

    await store.dispatch(actions.fetchDatasets());

    return { ...props };
  }

  render() {
    return <Explore />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    explore: state.explore
  }),
  actions
)(ExplorePage);
