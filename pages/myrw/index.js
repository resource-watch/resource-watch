import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { getUserAreas } from 'redactions/user';

// components
import LayoutMyRW from 'layout/myrw';

class MyRWPage extends PureComponent {
  static propTypes = { getUserAreas: PropTypes.func.isRequired }

  componentWillMount() {
    this.props.getUserAreas();
  }

  render() {
    return (<LayoutMyRW />);
  }
}

export default connect(
  null,
  { getUserAreas }
)(MyRWPage);
