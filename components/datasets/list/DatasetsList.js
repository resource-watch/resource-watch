import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import DatasetsListCard from 'components/datasets/list/DatasetsListCard';

class DatasetsList extends PureComponent {
  onSearch = (value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  render() {
    const { datasets, routes, user, filters, loading } = this.props;

    return (
      <div className="c-datasets-list">
        {loading && <Spinner className="-light" isLoading={loading} />}

        <SearchInput
          input={{
            placeholder: 'Search dataset'
          }}
          link={{
            label: 'New dataset',
            route: routes.detail,
            params: { tab: 'datasets', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        <div className="l-row row list">
          {datasets.map(dataset => (
            <div
              className="column list-item small-12 medium-4"
              key={dataset.id}
            >
              <DatasetsListCard
                dataset={dataset}
                routes={routes}
                token={user.token}
                onDatasetRemoved={() => {}}
              />
            </div>
          ))}
          {!datasets.length &&
            <div className="text-container">
              {!!(filters.length) &&
                'There were no datasets found with the current filter'
              }
            </div>
          }
          {!datasets.length && !loading && !(filters.length) &&
            <div className="text-container">
              There are no datasets added in this collection yet
            </div>
          }
        </div>
      </div>
    );
  }
}

DatasetsList.defaultProps = {
  routes: {
    index: '',
    detail: ''
  },
  getDatasetsFilters: {},
  datasets: [],
  filters: []
};

DatasetsList.propTypes = {
  routes: PropTypes.object,
  user: PropTypes.object,
  filters: PropTypes.array,
  datasets: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  setFilters: PropTypes.func.isRequired
};

export default DatasetsList;
