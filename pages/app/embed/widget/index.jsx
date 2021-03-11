import React, { PureComponent } from 'react';

// actions
import { getWidget, checkIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedWidget from 'layout/embed/widget';

class EmbedWidgetPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const {
      routes: { query: { id, webshot } },
      user
    } = getState();

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    await dispatch(getWidget(id, { includes: ['metadata'].join(',') }));

    if (!webshot) {
      if (user && user.id) dispatch(checkIfFavorited(id));
    }

    return ({});
  }

  render() {
    return (<LayoutEmbedWidget {...this.props} />);
  }
}

export default EmbedWidgetPage;
