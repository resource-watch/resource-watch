import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import WidgetsTable from 'components/admin/data/widgets/table';

class WidgetsIndex extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-widgets-index">
        <WidgetsTable authorization={token} />
      </div>
    );
  }
}

export default WidgetsIndex;
