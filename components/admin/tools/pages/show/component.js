import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import ToolsForm from 'components/admin/tools/form/ToolsForm';

class ToolsShow extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  handleSubmit = () => Router.pushRoute('admin_tools', { tab: 'tools' });

  render() {
    const {
      id,
      user: { token }
    } = this.props;

    return (
      <div className="c-tools-show">
        <ToolsForm
          id={id}
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default ToolsShow;
