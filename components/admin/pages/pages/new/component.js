import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import PagesForm from 'components/admin/pages/form/PagesForm';

class PagesNew extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleSubmit = () => {
    const {
      router,
    } = this.props;

    router.push('/admin/pages');
  }

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

export default withRouter(PagesNew);
