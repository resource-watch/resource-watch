import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedSimilarDatasetsPage from './component';

class EmbedSimilarDatasetsPageContainer extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return {};
  }

  render() {
    return (<EmbedSimilarDatasetsPage {...this.props} />);
  }
}

export default connect(
  state => ({ loading: state.similarDatasets.loading }),
  null
)(EmbedSimilarDatasetsPageContainer);
