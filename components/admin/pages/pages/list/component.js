import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import PagesTable from 'components/admin/pages/table/PagesTable';

class PagesIndex extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-pages-index">
        <PagesTable authorization={token} />
      </div>
    );
  }
}

export default PagesIndex;
