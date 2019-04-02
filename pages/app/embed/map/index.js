import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import {
  getWidget,
  toggleLayerGroupVisibility,
  checkIfFavorited,
  setIfFavorited
} from 'redactions/widget';
import { setEmbed, setWebshotMode } from 'redactions/common';

// components
import EmbedMapPage from './component';

class EmbedMapPageContainer extends PureComponent {
  static async getInitialProps({ store, isServer, req }) {
    const { dispatch, getState } = store;
    const { routes: { query: { webshot } } } = getState();
    const referer = isServer ? req.headers.referer : window.location.href;

    dispatch(setEmbed(true));
    if (webshot) dispatch(setWebshotMode(true));
    return { referer };
  }

  render() {
    return (<EmbedMapPage {...this.props} />);
  }
}

export default connect(
  state => ({
    widget: state.widget.data,
    loading: state.widget.loading,
    error: state.widget.error,
    layerGroups: state.widget.layerGroups,
    zoom: state.widget.zoom,
    favourited: state.widget.favourite.favourited,
    latLng: state.widget.latLng,
    user: state.user,
    webshot: state.common.webshot
  }),
  {
    getWidget,
    toggleLayerGroupVisibility,
    checkIfFavorited,
    setIfFavorited
  }
)(EmbedMapPageContainer);
