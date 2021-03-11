import React, { PureComponent } from 'react';

// actions
import { setEmbed } from 'redactions/common';

// components
import LayoutEmbedDataset from 'layout/embed/dataset';


class EmbedDatasetPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch } = store;

    dispatch(setEmbed(true));

    return ({});
  }

  render() {
    return (<LayoutEmbedDataset {...this.props} />);
  }
}

export default EmbedDatasetPage;
