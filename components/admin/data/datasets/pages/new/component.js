import { PureComponent } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';

// Components
import DatasetsForm from 'components/datasets/form/DatasetsForm';

class DatasetsNew extends PureComponent {
  handleSubmit = (id) => {
    const {
      router,
    } = this.props;

    router.push(`/admin/data/datasets/${id}`);
  }

  render() {
    const { user: { token } } = this.props;

    return (
      <div className="c-datasets-new">
        <DatasetsForm
          application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
          authorization={token}
          onSubmit={this.handleSubmit}
          basic={false}
        />
      </div>
    );
  }
}

DatasetsNew.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(DatasetsNew);
