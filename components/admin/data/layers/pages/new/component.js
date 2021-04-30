import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import LayersForm from 'components/admin/data/layers/form/LayersForm';

class LayersNew extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.shape({
        dataset: PropTypes.string,
      }),
    }).isRequired,
  }

  static defaultProps = { dataset: null }

  handleSubmit = (layerID, datasetID) => {
    const {
      router,
    } = this.props;

    if (layerID && datasetID) {
      router.push(`/admin/data/layers/${layerID}/edit?dataset=${datasetID}`);
    } else {
      router.push('/admin/data/layers');
    }
  }

  render() {
    const {
      user: { token },
      router: {
        query: {
          dataset,
        },
      },
    } = this.props;

    return (
      <div className="c-layers-new">
        <LayersForm
          application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
          authorization={token}
          onSubmit={this.handleSubmit}
          dataset={dataset}
        />
      </div>
    );
  }
}

export default withRouter(LayersNew);
