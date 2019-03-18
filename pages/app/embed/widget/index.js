import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedWidgetPage from './component';

class EmbedWidgetPageContainer extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const {
      routes: { query: { id, webshot } },
      user
    } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

    if (!webshot) {
      if (user && user.id) dispatch(checkIfFavorited(id));
    }

    return { referer };
  }

  render() {
    return (<EmbedWidgetPage {...this.props} />);
  }
}

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    favourited: state.widget.favourite.favourited,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedWidgetPageContainer);
