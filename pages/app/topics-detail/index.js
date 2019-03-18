import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getTopic, setSelected } from 'modules/topics/actions';
import TopicDetailLayout from 'layout/topics-detail';

// components
import Page from 'layout/page';
import Error from 'pages/_error';

class TopicDetailPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    topicsDetail: PropTypes.object,
    setSelected: PropTypes.func.isRequired
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;

    // Fetch topic
    if (props.url.query.id) await store.dispatch(getTopic(props.url.query.id));

    // set current topic in thumbnail list
    store.dispatch(setSelected(props.url.query.id));

    return props;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    this.props.setSelected(null);
  }

  render() {
    const { topicsDetail } = this.props;

    if (isEmpty(topicsDetail)) return <Error statusCode={404} />;

    return <TopicDetailLayout />;
  }
}

export default withRedux(
  initStore,
  state => ({ topicsDetail: state.topics.detail.data }),
  { setSelected }
)(TopicDetailPage);
