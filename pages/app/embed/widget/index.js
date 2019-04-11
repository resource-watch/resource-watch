import React, { PureComponent } from 'react';

// actions
import { getWidget, checkIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedWidget from 'layout/embed/widget';

class EmbedWidgetPage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const {
      routes: { query: { id, webshot } },
      user
    } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;
    const hostname = isServer ? req.headers.host : window.location.origin;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

    if (!webshot) {
      if (user && user.id) dispatch(checkIfFavorited(id));
    }

    return { referer, hostname };
  }

  render() {
    return (<LayoutEmbedWidget {...this.props} />);
  }
}

export default EmbedWidgetPage;
