import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

class DashboardsNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired };

  render() {
    const { user } = this.props;

    return (
      <div className="c-dashboards-new">
        <DashboardsForm
          basic
          user={user}
          onSubmit={() => Router.pushRoute('myrw', { tab: 'dashboards' })}
        />
      </div>
    );
  }
}

export default DashboardsNew;
