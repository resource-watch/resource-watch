/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';
import Error from 'pages/_error';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/app/topic-detail/topic-detail-actions';
import TopicDetail from 'pages/app/topic-detail/topic-detail';

class TopicDetailPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    topicDetail: PropTypes.object,
    locale: PropTypes.string.isRequired
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;

    // Fetch topic
    await store.dispatch(actions.fetchTopic({ id: props.url.query.id }));

    return { ...props };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      topicDetail
    } = this.props;

    const { data: topic } = topicDetail;
    if (topic && !topic.published) return <Error status={404} />;

    return <TopicDetail />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    topicDetail: state.topicDetail
  }),
  actions
)(TopicDetailPage);
