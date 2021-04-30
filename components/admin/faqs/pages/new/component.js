import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

class FaqsNew extends PureComponent {
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
    router.push('/admin/faqs');
  }

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

export default withRouter(FaqsNew);
