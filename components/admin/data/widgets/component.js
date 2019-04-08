import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import WidgetsNew from 'components/admin/data/widgets/pages/new';
import WidgetsShow from 'components/admin/data/widgets/pages/show';

class WidgetsTab extends PureComponent {
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
      <div className="c-widgets-tab">
        {(token && id) && (id === 'new') && (<WidgetsNew />)}
        {(token && id) && (id !== 'new') && (<WidgetsShow />)}
      </div>
    );
  }
}

export default WidgetsTab;
