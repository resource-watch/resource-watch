import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Router } from 'routes';

// Components
import ExploreDetail from 'layout/explore-detail';
import Error from 'pages/_error';

// actions
import { setIsServer } from 'redactions/common';
import * as actions from 'layout/explore-detail/explore-detail-actions';


import { PARTNERS_CONNECTIONS } from 'constants/partners';

class ExploreDetailPage extends PureComponent {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    statusCode: PropTypes.number.isRequired,
    setIsServer: PropTypes.func.isRequired,
    fetchTags: PropTypes.func.isRequired,
    setCountView: PropTypes.func.isRequired
  };

  static async getInitialProps({ store, res }) {
    const { dispatch, getState } = store;
    const { routes: { query: { id: queryId } } } = getState();


    await dispatch(actions.getDataset({ id: queryId }));

    // Check if the dataset exists and it is published
    const { exploreDetail } = store.getState();
    const dataset = exploreDetail.data;
    // This line has temporarily been commented out meanwhile we implement a more robust
    // and structured approach for this
    // if ((!dataset && res) || (dataset && res && !dataset.published)) res.statusCode = 404;

    const { id, vocabulary } = dataset;

    // Set tags
    const tags = vocabulary && vocabulary.length > 0 && vocabulary[0].tags;
    if (tags) {
      dispatch(actions.setActiveTags(tags));
    }

    // loads connected partner
    if (PARTNERS_CONNECTIONS[id]) {
      await dispatch(actions.fetchPartner({ id }));
    } else {
      // If we dont have a partner connection, make sure to remove the previous one if isset
      dispatch(actions.setPartner(null));
    }

    return { ...(res && { statusCode: res.statusCode }) };
  }

  componentDidMount() {
    if (this.props.routes.asPath === '/data/explore/Powerwatch') {
      Router.replaceRoute('/data/explore/a86d906d-9862-4783-9e30-cdb68cd808b8');
    }
    this.props.fetchTags();
    this.props.setCountView();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.routes.query.id !== nextProps.routes.query.id) {
      window.scrollTo(0, 0);
      this.props.fetchTags();
      this.props.setCountView();
    }

    this.props.setIsServer(false);
  }

  render() {
    const { statusCode } = this.props;

    if (statusCode && (statusCode > 200)) return (<Error statusCode={statusCode} />);

    return (<ExploreDetail />);
  }
}

export default connect(
  state => ({
    exploreDetail: state.exploreDetail,
    routes: state.routes
  }),
  {
    ...actions,
    setIsServer
  }
)(ExploreDetailPage);
