import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Services
import DatasetsService from 'services/DatasetsService';

// Components
import Spinner from 'components/ui/Spinner';
import DatasetsListCard from './dataset-list-card-component';

class DatasetsList extends PureComponent {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    datasets: [],
    filters: [],
    loading: true
  };

  static propTypes = {
    routes: PropTypes.object,
    datasets: PropTypes.array,
    filters: PropTypes.array,
    loading: PropTypes.bool,
    user: PropTypes.object,
    locale: PropTypes.string.isRequired,
    currentTab: PropTypes.string,
    getDatasetsByTab: PropTypes.func
  };

  constructor(props) {
    super(props);

    // service shouldn't be here.
    this.service = new DatasetsService({
      authorization: props.user.token,
      language: props.locale
    });
  }

  handleDatasetDelete = (dataset) => {
    const metadata = dataset.metadata[0];

    toastr.confirm(
      `Are you sure you want to delete the dataset: ${
        metadata && metadata.attributes.info ? metadata.attributes.info.name : dataset.name
      }?`,
      {
        onOk: () => {
          this.service
            .deleteData(dataset.id)
            .then(() => {
              toastr.success('Success', 'Dataset removed successfully');
              this.props.getDatasetsByTab(this.props.currentTab);
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
          {!datasets.length && (
            <div className="text-container">
              {!!filters.length && 'There were no datasets found with the current filter'}
            </div>
          )}
          {!datasets.length &&
            !loading &&
            !filters.length && (
              <div className="text-container">
                There are no datasets added in this collection yet
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default DatasetsList;
