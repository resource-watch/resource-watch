/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
// import { getInsights } from 'redactions/insights';

import * as actions from 'layout/get-involved-detail/get-involved-detail-actions';

import GetInvolvedDetail from 'layout/get-involved-detail';

class GetInvolvedDetailPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    locale: PropTypes.string
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    const { routes } = context.store.getState();

    // Get static data
    await context.store.dispatch(actions.fetchStaticData(routes.query.id));

    // if (routes.query.id === 'submit-an-insight') {
    //   await context.store.dispatch(getInsights());
    // }

    const breadcrumbsItems = routes.query.source === 'home' ?
      [{ name: 'Home', href: '/' }] :
      [{ name: 'Get involved', href: '/get-involved' }];

    return { ...props, breadCrumb: breadcrumbsItems };
  }

  render() {
    const {
      breadCrumb,
      url
    } = this.props;

    return <GetInvolvedDetail breadCrumb={breadCrumb} url={url} />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    getInvolvedDetail: state.getInvolvedDetail,
    user: state.user
  }),
  actions
)(GetInvolvedDetailPage);
