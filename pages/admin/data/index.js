/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/admin/data/data-actions';

import { getWidgets } from 'redactions/admin/widgets';

import DataDetails from 'pages/admin/data/data-details';

class DataPage extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;

    await store.dispatch(actions.getDatasets(props.url.query.page));

    if (props.url.query.tab === 'widgets') {
      await store.dispatch(getWidgets({
        filters: {
          ...props.dataset && { dataset: props.dataset },
          'page[size]': 9999
        }
      }));
    }
    return { ...props };
  }

  componentWillMount() {
    const {
      url,
      adminDataPage,
      setActiveTab,
      setPageParams
    } = this.props;

    if (url.query && url.query.tab !== adminDataPage.defaultTab &&
       adminDataPage.availableTabs.find(tab => tab.value === url.query.tab)) {
      setActiveTab(url.query.tab);
    }

    if (url.query.id || url.query.subtab) {
      setPageParams({ id: url.query.id, subtab: url.query.subtab });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      adminDataPage,
      setActiveTab,
      setPageParams,
      getDatasets
    } = this.props;

    if (nextProps.url.query.tab !== adminDataPage.tab &&
        adminDataPage.availableTabs.find(tab => tab.value === nextProps.url.query.tab)) {
      setActiveTab(nextProps.url.query.tab);
    }

    if (nextProps.url.query.id !== adminDataPage.id ||
        nextProps.url.query.subtab !== adminDataPage.subtab) {
      setPageParams({ id: nextProps.url.query.id, subtab: nextProps.url.query.subtab });
    }
    /*
    // If we want to get only the current page, activate these lines
    if (adminDataPage.datasets.activePage !== nextProps.adminDataPage.datasets.activePage) {
      window.scrollTo(0, 0);
      getDatasets(nextProps.adminDataPage.datasets.activePage);
    }
    */
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
    widgets: state.widgets,
    datasets: state.datasets
  }),
  actions
)(DataPage);
