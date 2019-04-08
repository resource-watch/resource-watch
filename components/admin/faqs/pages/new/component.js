import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

class FaqsNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = () => Router.pushRoute('admin_faqs', { tab: 'faqs' })

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-faqs-new">
        <FaqsForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default FaqsNew;
