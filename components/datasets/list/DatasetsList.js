import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import { getDatasets, setFilters } from 'redactions/admin/datasets';

// Selectors
import getFilteredDatasets from 'selectors/admin/datasets';

// Components
import DatasetsListCard from 'components/datasets/list/DatasetsListCard';

class DatasetsList extends React.Component {
  componentDidMount() {
    this.props.setFilters([]);
    this.props.getDatasets();
  }

  render() {
    const { datasets, routes } = this.props;

    return (
      <div className="c-dataset-list">
        <div className="l-row row list">
          {datasets.map(dataset => (
            <div
              className="column list-item small-12 medium-4"
              key={dataset.id}
            >
              <DatasetsListCard
                dataset={dataset}
                routes={routes}
              />
            </div>
          ))}
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
  // Store
  datasets: []
};

DatasetsList.propTypes = {
  routes: PropTypes.object,

  // Store
  user: PropTypes.object,
  datasets: PropTypes.array.isRequired,

  // Actions
  getDatasets: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  loading: state.datasets.datasets.loading,
  datasets: getFilteredDatasets(state),
  error: state.datasets.datasets.error
});
const mapDispatchToProps = dispatch => ({
  getDatasets: () => dispatch(getDatasets()),
  setFilters: filters => dispatch(setFilters(filters))
});

export default connect(mapStateToProps, mapDispatchToProps)(DatasetsList);
