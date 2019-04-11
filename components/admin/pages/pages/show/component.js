import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router } from 'routes';

// components
import PagesForm from 'components/admin/pages/form/PagesForm';

class PagesShow extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  }

  handleSubmit = () => Router.pushRoute('admin_pages', { tab: 'pages' })

  render() {
    const {
      id,
      user: { token }
    } = this.props;

    return (
      <div className="c-pages-show">
        <PagesForm
          id={id}
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default PagesShow;
