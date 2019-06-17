import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Link } from 'routes';

// Services
import { deleteDataset } from 'services/dataset';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetsListCard from './dataset-list-card-component';

class DatasetsList extends PureComponent {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    currentTab: ''
  };

  static propTypes = {
    routes: PropTypes.object,
    datasets: PropTypes.array.isRequired,
    filters: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    currentTab: PropTypes.string,
    getDatasetsByTab: PropTypes.func.isRequired
  };

  handleDatasetDelete = (dataset) => {
    const metadata = dataset.metadata[0];
    const { user, currentTab } = this.props;

    toastr.confirm(
      `Are you sure you want to delete the dataset: ${
        metadata && metadata.attributes.info ? metadata.attributes.info.name : dataset.name
      }?`,
      {
        onOk: () => {
          deleteDataset(dataset.id, user.token)
            .then(() => {
              toastr.success('Success', 'Dataset removed successfully');
              this.props.getDatasetsByTab(currentTab);
            })
            .catch(err => toastr.error('Error deleting the dataset', err));
        }
      }
    );
  };

  render() {
    const { datasets, routes, user, filters, loading } = this.props;

    return (
      <div className="c-datasets-list">
        {loading && <Spinner className="-light" isLoading={loading} />}

        <div className="l-row row list -equal-height">
          {datasets.map(dataset => (
            <div className="column list-item small-12 medium-4" key={dataset.id}>
              <DatasetsListCard
                dataset={dataset}
                routes={routes}
                user={user}
                onDatasetRemoved={this.handleDatasetDelete}
              />
            </div>
          ))}
        </div>
        {!datasets.length && (
          <div className="no-data-div">
            {!!filters.length && `Your search '${filters[0].value}' didn't return any results`}
          </div>
          )}
        {!datasets.length &&
          !loading &&
          !filters.length && (
            <div className="no-data-div">There are no datasets added in this collection yet</div>
          )}

        <div className="c-button-container -j-center c-field-buttons">
          <Link route="explore">
            <a className="c-button -secondary">Explore Datasets</a>
          </Link>
        </div>
      </div>
    );
  }
}

export default DatasetsList;
