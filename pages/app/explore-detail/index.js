/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// Components
import Page from 'layout/page';
import Error from 'pages/_error';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setIsServer } from 'redactions/common';
import * as actions from 'layout/explore-detail/explore-detail-actions';
import ExploreDetail from 'layout/explore-detail';

import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';

class ExploreDetailPage extends Page {
  static propTypes = {
    exploreDetail: PropTypes.object,
    setIsServer: PropTypes.func.isRequired
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
    } else {
      // If we dont have a partner connection, make sure to remove the previous one if isset
      store.dispatch(actions.setPartner(null));
    }

    return { ...props };
  }

  componentDidMount() {
    if (this.props.url.asPath === '/data/explore/Powerwatch') {
      Router.replaceRoute('/data/explore/a86d906d-9862-4783-9e30-cdb68cd808b8');
    }
    this.props.fetchTags();
    this.props.setCountView();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
      this.props.fetchTags();
      this.props.setCountView();
    }

    this.props.setIsServer(false);
  }

  render() {
    const { exploreDetail } = this.props;

    const { data: dataset } = exploreDetail;
    if (dataset && !dataset.published) return <Error status={404} />;

    return <ExploreDetail />;
  }
}

export default withRedux(
  initStore,
  state => ({ exploreDetail: state.exploreDetail }),
  {
    ...actions,
    setIsServer
  }
)(ExploreDetailPage);
