import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutMyRW from 'layout/myrw';

class MyRWPage extends PureComponent {
  static propTypes = { getUserAreas: PropTypes.func.isRequired }

  componentWillMount() {
    const { getUserAreas } = this.props;

    getUserAreas();
  }

  render() {
    return (
      <LayoutMyRW />
    );
  }
}

export default MyRWPage;
