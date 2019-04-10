import React, { PureComponent } from 'react';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import LayoutEmbedSimilarDatasets from 'layout/embed/similar-datasets';

class EmbedSimilarDatasetsPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return {};
  }

  render() {
    return (<LayoutEmbedSimilarDatasets />);
  }
}

export default EmbedSimilarDatasetsPage;
