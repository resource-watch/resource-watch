import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import WidgetForm from 'components/admin/data/widgets/form';

class WidgetsNew extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  }

  handleSubmit = (widget) => {
    const {
      router,
    } = this.props;

    if (widget) {
      router.push(`/admin/data/widgets/${widget.id}/edit?dataset=${widget.dataset}`);
    } else {
      router.push('/admin/data/widgets');
    }
  }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-widgets-new">
        <WidgetForm
          authorization={token}
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default withRouter(WidgetsNew);
