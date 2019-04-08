import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import WidgetsForm from 'components/admin/data/widgets/form/WidgetsForm';

class WidgetsNew extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    user: PropTypes.object.isRequired
  }

  static defaultProps = { dataset: null }

  handleSubmit = () => {
    const { dataset } = this.props;

    if (dataset) {
      Router.pushRoute('admin_data_detail', { tab: 'datasets', subtab: 'widgets', id: dataset });
    } else {
      Router.pushRoute('admin_data', { tab: 'widgets' });
    }
  }

  render() {
    const {
      user: { token },
      dataset
    } = this.props;

    return (
      <div className="c-widgets-new">
        <WidgetsForm
          authorization={token}
          dataset={dataset}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default WidgetsNew;
