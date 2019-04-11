import React, { PureComponent } from 'react';

// actions
import { setEmbed } from 'redactions/common';

// components
import LayoutEmbedDataset from 'layout/embed/dataset';


class EmbedDatasetPage extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch } = store;

    dispatch(setEmbed(true));

    return { referer: isServer ? req.headers.referer : window.location.href };
  }

  render() {
    return (<LayoutEmbedDataset {...this.props} />);
  }
}

export default EmbedDatasetPage;
