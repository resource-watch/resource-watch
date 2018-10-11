/* eslint max-len: 0 */
import React from 'react';

// Components
import Page from 'layout/page';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'layout/pulse/actions';
import Pulse from 'layout/pulse';
import { setIsServer } from 'redactions/common';

class PulsePage extends Page {
  componentDidMount() {
    this.props.setIsServer(false);
  }

  render() {
    return <Pulse />;
  }
}

export default withRedux(
  initStore,
  null,
  { ...actions, setIsServer }
)(PulsePage);
