/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

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
    const { tab, page, search, sort } = props.url.query;

    if (search) {
      context.store.dispatch(actions.setDatasetSearchTerm(search));
    }

    if (sort) {
      context.store.dispatch(actions.setDatasetSort(JSON.parse(sort)));
    }

    if (page) {
      context.store.dispatch(actions.setDatasetPage(page));
    }

    if (!tab || tab === 'datasets') {
      context.store.dispatch(actions.setActiveTab('datasets'));
      await context.store.dispatch(actions.getDatasets());
    }

    if (tab === 'widgets') {
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

  componentDidMount() {
    const {
      url,
      setDatasetUrl,
      setDatasetPage
    } = this.props;

    // if user enters /admin, we need to shallow update the url
    if (!url.query.tab || url.query.tab === 'datasets') {
      setDatasetPage(1);
      setDatasetUrl({ shallow: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      adminDataPage,
      setActiveTab,
      setPageParams
    } = this.props;

    if (nextProps.url.query.tab !== adminDataPage.tab &&
        adminDataPage.availableTabs.find(tab => tab.value === nextProps.url.query.tab)) {
      setActiveTab(nextProps.url.query.tab);
    }

    if (nextProps.url.query.id !== adminDataPage.id ||
        nextProps.url.query.subtab !== adminDataPage.subtab) {
      setPageParams({ id: nextProps.url.query.id, subtab: nextProps.url.query.subtab });
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
    widgets: state.widgets,
    datasets: state.datasets
  }),
  actions
)(DataPage);
