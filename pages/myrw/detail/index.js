import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';

// components
import LayoutMyRWDetail from 'layout/myrw/detail';


class MyRWDetailPage extends PureComponent {
  static propTypes = { getUserAreas: PropTypes.func.isRequired }

  UNSAFE_componentWillMount() {
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
