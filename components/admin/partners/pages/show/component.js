import React, { PureComponent } from 'react';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// components
import PartnersForm from 'components/admin/partners/form/PartnersForm';

class PartnersShow extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  handleSubmit = () => Router.pushRoute('admin_partners', { tab: 'partners' })

  render() {
    const {
      id,
      user: { token }
    } = this.props;

    return (
      <div className="c-partners-show">
        <PartnersForm
          id={id}
          token={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default PartnersShow;
