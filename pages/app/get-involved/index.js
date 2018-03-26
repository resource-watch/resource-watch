/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

import * as actions from 'layout/get-involved/get-involved-actions';
// import { getStaticData } from 'redactions/static_pages';

import GetInvolved from 'layout/get-involved';

class GetInvolvedPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    url: PropTypes.object,
    locale: PropTypes.string
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Get static data
    await context.store.dispatch(actions.fetchStaticData('get-involved'));

    return { ...props };
  }

  render() {
    return <GetInvolved />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    getInvolvedIndex: state.getInvolvedIndex,
    user: state.user
  }),
  actions
)(GetInvolvedPage);
