import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import PartnersForm from 'components/admin/partners/form/PartnersForm';

class PartnersNew extends PureComponent {
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

    router.push('/admin/partners');
  }

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

export default withRouter(PartnersNew);
