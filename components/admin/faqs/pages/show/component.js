import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

class FaqsShow extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  handleSubmit = () => { Router.pushRoute('admin_faqs', { tab: 'faqs' }); }

  render() {
    const {
      id,
      user: { token }
    } = this.props;

    return (
      <div className="c-faqs-show">
        <FaqsForm
          id={id}
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default FaqsShow;
