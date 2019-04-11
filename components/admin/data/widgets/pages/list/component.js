import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import WidgetsTable from 'components/admin/data/widgets/table/WidgetsTable';

class WidgetsIndex extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    dataset: PropTypes.string
  }

  static defaultProps = { dataset: null }

  render() {
    const {
      dataset,
      user: { token }
    } = this.props;

    return (
      <div className="c-widgets-index">
        <WidgetsTable
          dataset={dataset}
          authorization={token}
        />
      </div>
    );
  }
}

export default WidgetsIndex;
