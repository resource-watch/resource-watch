import React, { PureComponent } from 'react';

// actions
import { setEmbed } from 'redactions/common';

// components
import LayoutEmbedMapSwipe from 'layout/embed/map-swipe';

class EmbedMapSwipePage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch, getState } = store;
    const { routes: { query } } = getState();
    const { layers } = query;

    dispatch(setEmbed(true));

    return { layerIds: layers.split(',') };
  }

  render() {
    return (<LayoutEmbedMapSwipe {...this.props} />);
  }
}

export default EmbedMapSwipePage;
