import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import DatasetNew from 'components/admin/data/datasets/pages/new';
import DatasetShow from 'components/admin/data/datasets/pages/show';

class DatasetsTab extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string
  }

  static defaultProps = { id: null }

  render() {
    const {
      id,
      user: { token }
    } = this.props;

    return (
      <div className="c-datasets-tab">
        {(id && id === 'new') && token && (<DatasetNew />)}
        {(id && id !== 'new') && token && (<DatasetShow />)}
      </div>
    );
  }
}

export default DatasetsTab;
