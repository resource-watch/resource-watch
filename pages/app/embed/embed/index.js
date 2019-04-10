import React, { PureComponent } from 'react';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedEmbed from 'layout/embed/embed';

class EmbedEmbedPage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return { referer };
  }

  render() {
    return (<LayoutEmbedEmbed {...this.props} />);
  }
}

export default EmbedEmbedPage;
