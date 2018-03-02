/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout/layout-admin';
import Error from 'pages/_error';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/admin/data/data-actions';
import { getWidgets } from 'redactions/admin/widgets';

import DataDetails from 'pages/admin/data/data-details';

class DataPage extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, res } = context;

    if (props.url.query.tab === 'widgets') {
      await store.dispatch(getWidgets());
    }

    return { ...props };
  }

  componentDidMount() {
    // this.props.fetchTags();
  }

  componentWillMount() {
    const { url, adminDataPage, setActiveTab } = this.props;
    if (url.query && url.query.tab !== adminDataPage.defaultTab &&
       adminDataPage.availableTabs.find(tab => tab.value === url.query.tab)) {
      setActiveTab(url.query.tab);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { adminDataPage, setActiveTab } = this.props;
    if (nextProps.url.query.tab !== adminDataPage.tab &&
        adminDataPage.availableTabs.find(tab => tab.value === nextProps.url.query.tab)) {
      setActiveTab(nextProps.url.query.tab);
    }
  }

  render() {
    return <DataDetails {...this.props} />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    adminDataPage: state.adminDataPage,
    user: state.user,
    widgets: state.widgets
  }),
  actions
)(DataPage);
