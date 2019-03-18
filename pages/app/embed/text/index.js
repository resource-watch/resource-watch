import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { getWidget } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedTextPage from './component';

class EmbedTextPageContainer extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return { referer };
  }

  render() {
    return (<EmbedTextPage {...this.props} />);
  }
}

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    bandDescription: state.widget.bandDescription,
    bandStats: state.widget.bandStats,
    webshot: state.common.webshot
  }),
  { getWidget }
)(EmbedTextPageContainer);
