import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import PartnersForm from 'components/admin/partners/form/PartnersForm';

class PartnersNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = () => { Router.pushRoute('admin_partners', { tab: 'partners' }); }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-partners-new">
        <PartnersForm
          token={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default PartnersNew;
