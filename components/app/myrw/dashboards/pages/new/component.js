import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import DashboardsForm from 'components/dashboards/form/DashboardsForm';

class DashboardsNew extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const {
      user,
      router,
    } = this.props;

    return (
      <div className="c-dashboards-new">
        <DashboardsForm
          basic
          user={user}
          onSubmit={() => router.push('/myrw/dashboards')}
        />
      </div>
    );
  }
}

export default withRouter(DashboardsNew);
