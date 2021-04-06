import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayersTable from 'components/admin/data/layers/table';

class LayersIndex extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    dataset: PropTypes.string,
  }

  static defaultProps = { dataset: null }

  render() {
    const {
      user: { token },
      dataset,
    } = this.props;

    return (
      <div className="c-layers-index">
        <LayersTable
          application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
          dataset={dataset}
          authorization={token}
        />
      </div>
    );
  }
}

export default LayersIndex;
