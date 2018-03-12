/* eslint max-len: 0 */
import React from 'react';

// Components
import Page from 'components/layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/pulse/actions';
import Pulse from 'layout/pulse';

class PulsePage extends Page {
  render() {
    return <Pulse />;
  }
}

export default withRedux(
  initStore,
  null,
  actions
)(PulsePage);
