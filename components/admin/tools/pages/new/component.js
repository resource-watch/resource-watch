import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import ToolsForm from 'components/admin/tools/form/ToolsForm';

class ToolsNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = () => Router.pushRoute('admin_tools', { tab: 'tools' })

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-tools-new">
        <ToolsForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default ToolsNew;
