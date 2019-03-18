import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutMyRWDetail from 'layout/myrw/detail';

class MyRWDetailPage extends PureComponent {
  static propTypes = { getUserAreas: PropTypes.func.isRequired }

  componentWillMount() {
    const { getUserAreas } = this.props;

    getUserAreas();
  }

  render() {
    return (
      <LayoutMyRWDetail />
    );
  }
}

export default MyRWDetailPage;
