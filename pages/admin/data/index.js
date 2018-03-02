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

import DataDetails from 'pages/admin/data/data-details';

// Contants
const DATA_TABS = [
  {
    label: 'Datasets',
    value: 'datasets',
    route: 'admin_data',
    params: { tab: 'datasets' }
  },
  {
    label: 'Widgets',
    value: 'widgets',
    route: 'admin_data',
    params: { tab: 'widgets' }
  },
  {
    label: 'Layers',
    value: 'layers',
    route: 'admin_data',
    params: { tab: 'layers' }
  }
];

class DataPage extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, res } = context;

    // await store.dispatch(actions.fetchDataset({ id: props.url.query.id }));
    return { ...props };
  }


  componentDidMount() {
    // this.props.fetchTags();
  }

  componentWillReceiveProps(nextProps) {
    /*
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
      this.props.fetchTags();
      this.props.setCountView();
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
    user: state.user
  }),
  actions
)(DataPage);
