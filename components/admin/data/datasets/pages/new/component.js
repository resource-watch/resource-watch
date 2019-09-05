import React, { PureComponent } from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Components
import DatasetsForm from 'components/datasets/form/DatasetsForm';

class DatasetsNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = () => { Router.pushRoute('admin_data', { tab: 'datasets' }); }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-datasets-new">
        <DatasetsForm
          application={[process.env.APPLICATIONS]}
          authorization={token}
          onSubmit={this.handleSubmit}
          basic={false}
        />
      </div>
    );
  }
}

export default DatasetsNew;

