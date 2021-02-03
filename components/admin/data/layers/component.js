import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayersNew from 'components/admin/data/layers/pages/new';
import LayersShow from 'components/admin/data/layers/pages/show';

class LayersTab extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    id: PropTypes.string,
  }

  static defaultProps = { id: null }

  render() {
    const {
      id,
      user: { token },
    } = this.props;

    return (
      <div className="c-layers-tab">
        {(token && id) && (id === 'new') && (<LayersNew />)}
        {(token && id) && (id !== 'new') && (<LayersShow />)}
      </div>
    );
  }
}

export default LayersTab;
