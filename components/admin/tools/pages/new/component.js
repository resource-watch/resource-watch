import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import ToolsForm from 'components/admin/tools/form/ToolsForm';

class ToolsNew extends PureComponent {
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

    router.push('/admin/tools');
  }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-tools-new">
        <ToolsForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default withRouter(ToolsNew);
