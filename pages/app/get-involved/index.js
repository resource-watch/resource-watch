import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// actions
import * as actions from 'layout/get-involved/get-involved-actions';

// components
import GetInvolved from 'layout/get-involved';

class GetInvolvedPage extends PureComponent {
  static async getInitialProps({ store }) {
    const { dispatch } = store;

    // Get static data
    await dispatch(actions.fetchStaticData('get-involved'));

    return {};
  }

  render() {
    return (<GetInvolved />);
  }
}

export default connect(
  state => ({
    getInvolvedIndex: state.getInvolvedIndex,
    user: state.user
  }),
  actions
)(GetInvolvedPage);
