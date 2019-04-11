import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import FaqsSortableList from 'components/admin/faqs/components/FaqsSortableList';

class FaqsIndex extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-faqs-index">
        <FaqsSortableList authorization={token} />
      </div>
    );
  }
}

export default FaqsIndex;
