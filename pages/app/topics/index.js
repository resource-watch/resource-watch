/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/topics/topics-actions';
import Topics from 'layout/topics';

class TopicsPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    topics: PropTypes.object,
    locale: PropTypes.string.isRequired
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    // Dashboard thumbnail list
    context.store.dispatch(actions.setSelected(null));

    await context.store.dispatch(actions.fetchTopics({
      filters: { 'filter[published]': 'true' }
    }));

    return { ...props };
  }

  render() {
    return <Topics />;
  }
}

export default withRedux(
  initStore,
  null,
  actions
)(TopicsPage);
