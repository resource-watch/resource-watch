import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';
import { getAllDashboards } from 'modules/dashboards/actions';

// components
import LayoutMyRWDetail from 'layout/myrw/detail';


class MyRWDetailPage extends PureComponent {
  static propTypes = { getUserAreas: PropTypes.func.isRequired }

  static async getInitialProps({ store, query: { tab } }) {
    const { getState, dispatch } = store;
    const { dashboards: { all } } = getState();
    if (!all.list.length && tab === 'dashboards') await dispatch(getAllDashboards());

    return {};
  }

  componentWillMount() {
    this.props.getUserAreas();
  }

  render() {
    return (<LayoutMyRWDetail />);
  }
}

export default connect(
  null,
  { getUserAreas }
)(MyRWDetailPage);
