import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import { getWidget, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedEmbedPage from './component';

class EmbedEmbedPageContainer extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));

    return { referer };
  }

  render() {
    return (<EmbedEmbedPage {...this.props} />);
  }
}

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    favourited: state.widget.favourite.favourited,
    user: state.user
  }),
  {
    getWidget,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedEmbedPageContainer);
