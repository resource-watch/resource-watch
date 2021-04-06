import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import WidgetForm from 'components/admin/data/widgets/form';

class WidgetsNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = (widget) => {
    if (widget) {
      Router.pushRoute('admin_data_detail', {
        tab: 'widgets',
        subtab: 'edit',
        id: widget.id,
        dataset: widget.dataset,
      });
    } else {
      Router.pushRoute('admin_data', { tab: 'widgets' });
    }
  }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-widgets-new">
        <WidgetForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default WidgetsNew;
