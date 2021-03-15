import React, { PureComponent } from 'react';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedText from 'layout/embed/text';

class EmbedTextPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return ({});
  }

  render() {
    return (<LayoutEmbedText {...this.props} />);
  }
}

export default EmbedTextPage;
