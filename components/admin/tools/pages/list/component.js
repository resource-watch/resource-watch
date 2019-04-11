import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import ToolsTable from 'components/admin/tools/table/ToolsTable';

class ToolsIndex extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  render() {
    const { user: { token } } = this.props;
    return (
      <div className="c-tools-index">
        <ToolsTable authorization={token} />
      </div>
    );
  }
}

export default ToolsIndex;
