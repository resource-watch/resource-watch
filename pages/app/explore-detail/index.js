/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Error from 'pages/_error';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/app/explore-detail/explore-detail-actions';
import ExploreDetail from 'pages/app/explore-detail/explore-detail';

import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';
import { TOOLS_CONNECTIONS } from 'utils/apps/toolsConnections';

class ExploreDetailPage extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, res } = context;

    await store.dispatch(actions.fetchDataset({ id: props.url.query.id }));

    // Check if the dataset exists and it is published
    const { exploreDetail } = store.getState();
    const dataset = exploreDetail.data;
    if (!dataset && res) res.statusCode = 404;
    if (dataset && res && !dataset.published) res.statusCode = 404;

    const { id, vocabulary } = dataset;

    // Set tags
    const tags = vocabulary && vocabulary.length > 0 && vocabulary[0].tags;
    if (tags) {
      store.dispatch(actions.setActiveTags(tags));
    }

    // Load connected partner
    const partnerConnection = PARTNERS_CONNECTIONS.find(pc => pc.datasetId === id);
    if (partnerConnection) {
      await store.dispatch(actions.fetchPartner({ id: partnerConnection.partnerId }));
    }

    // Set tools and load connected tools
    const toolsConnections = TOOLS_CONNECTIONS.filter(appC => appC.datasetId === id).map(v => v.appSlug);
    if (toolsConnections.length > 0) {
      store.dispatch(actions.setActiveTools(toolsConnections));
      await store.dispatch(actions.fetchTools());
    }

    return { ...props };
  }

  /**
   * Component Lifecycle
   * - componentDidMount
   * - componentWillReceiveProps
   * - componentWillUnmount
  */
  componentDidMount() {
    this.props.fetchTags();
    this.props.setCountView();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
      this.props.fetchTags();
      this.props.setCountView();
    }
  }

  render() {
    const {
      exploreDetail
    } = this.props;

    const { data: dataset } = exploreDetail;
    if (dataset && !dataset.published) return <Error status={404} />;

    return <ExploreDetail />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    exploreDetail: state.exploreDetail
  }),
  actions
)(ExploreDetailPage);
