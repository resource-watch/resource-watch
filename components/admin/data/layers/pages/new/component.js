import React, { PureComponent } from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// components
import LayersForm from 'components/admin/data/layers/form/LayersForm';

class LayersNew extends PureComponent {
  static propTypes = {
    dataset: PropTypes.string,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = { dataset: null }

  handleSubmit = (layerID, datasetID) => {
    if (layerID && datasetID) {
      Router.pushRoute('admin_data_detail', {
        tab: 'layers', id: layerID, subtab: 'edit', dataset: datasetID,
      });
    } else {
      Router.pushRoute('admin_data', { tab: 'layers' });
    }
  }

  render() {
    const {
      user: { token },
      dataset,
    } = this.props;

    return (
      <div className="c-layers-new">
        <LayersForm
          application={[process.env.APPLICATIONS]}
          authorization={token}
          onSubmit={this.handleSubmit}
          dataset={dataset}
        />
      </div>
    );
  }
}

export default LayersNew;
