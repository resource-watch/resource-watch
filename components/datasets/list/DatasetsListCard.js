import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';

// Redux
import { connect } from 'react-redux';

// Services
import DatasetsService from 'services/DatasetsService';

class DatasetsListCard extends React.Component {
  constructor(props) {
    super(props);

    // SERVICES
    this.service = new DatasetsService({
      authorization: props.token,
      language: props.locale
    });
  }

  @Autobind
  handleDelete() {
    const { dataset } = this.props;
    const metadata = dataset.metadata[0];
    toastr.confirm(`Are you sure you want to delete the dataset: ${metadata && metadata.attributes.info ? metadata.attributes.info.name : dataset.name}?`, {
      onOk: () => {
        this.service.deleteData(dataset.id)
          .then(() => {
            toastr.success('Success', 'Dataset removed successfully');
            this.props.onDatasetRemoved(dataset.id);
          })
          .catch(err => toastr.error('Error deleting the dataset', err));
      }
    });
  }

  render() {
    const { dataset, routes } = this.props;
    const metadata = dataset.metadata[0];
    return (
      <div className="c-card c-datasets-list-card">
        <div className="card-container">
          <header className="card-header">
            <Link
              route={routes.detail}
              params={{ tab: 'datasets', id: dataset.id }}
            >
              <a>
                <Title className="-default">
                  {metadata && metadata.attributes.info ? metadata.attributes.info.name : dataset.name}
                </Title>
              </a>
            </Link>
            <Title className="-small">
              {dataset.provider}
            </Title>
          </header>

          <div className="card-content">
            {dataset.status === 'saved' &&
              <DatasetsRelatedContent
                dataset={dataset}
                route={routes.detail}
              />
            }
            {dataset.status !== 'saved' &&
              dataset.status
            }
          </div>

          <div className="actions">
            <a
              role="button"
              tabIndex={0}
              onClick={this.handleDelete}
            >
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}

DatasetsListCard.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  dataset: {}
};

DatasetsListCard.propTypes = {
  dataset: PropTypes.object,
  routes: PropTypes.object,
  token: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  // Callbacks
  onDatasetRemoved: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(DatasetsListCard);
