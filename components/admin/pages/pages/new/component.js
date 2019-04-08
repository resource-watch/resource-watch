import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import PagesForm from 'components/admin/pages/form/PagesForm';

class PagesNew extends PureComponent {
  static propTypes = { user: PropTypes.object.isRequired }

  handleSubmit = () => Router.pushRoute('admin_pages', { tab: 'pages' })

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-pages-new">
        <PagesForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default PagesNew;
