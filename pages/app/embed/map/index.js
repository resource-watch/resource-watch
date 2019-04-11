import React, { PureComponent } from 'react';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';
import { getWidget } from 'redactions/widget';

// components
import LayoutEmbedMap from 'layout/embed/map';

class EmbedMapPage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot, id } } } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;
    const hostname = isServer ? req.header.host : window.location.origin;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));
    await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

    return { referer, hostname };
  }

  render() {
    return (<LayoutEmbedMap {...this.props} />);
  }
}

export default EmbedMapPage;
