import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Next
import { Link } from 'routes';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setFilters } from 'redactions/admin/datasets';

// Components
import DatasetTable from 'components/admin/dataset/table/DatasetTable';
import CustomSelect from 'components/ui/CustomSelect';

class DatasetIndex extends React.Component {
  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  @Autobind
  onSearch({ value }) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  /**
   * Return the dataset options for the search input
   * @returns {{ label: string, value: string }}
   */
  getSelectOptions() {
    return this.props.datasets.map(dataset => ({
      label: dataset.attributes.name,
      value: dataset.id
    }));
  }

  render() {
    const { user } = this.props;
    return (
      <div className="c-datasets-index">
        <div className="actions">
          <CustomSelect
            options={this.getSelectOptions()}
            onKeyPressed={this.onSearch}
            search
            placeholder="Search dataset"
            hideList
          />
          <Link route="admin_data_detail" params={{ tab: 'datasets', id: 'new' }}>
            <a className="c-button -secondary">New Dataset</a>
          </Link>
        </div>
        <DatasetTable
          application={['rw']}
          authorization={user.token}
        />
      </div>
    );
  }
}

DatasetIndex.propTypes = {
  datasets: PropTypes.array.isRequired,
  // Redux
  setFilters: PropTypes.func.isRequired
};

DatasetIndex.defaultProps = {
  datasets: []
};

const mapStateToProps = ({ datasets, user }) => ({
  datasets: datasets.datasets.list,
  user
});

const mapDispatchToProps = dispatch => ({
  setFilters: filters => dispatch(setFilters(filters))
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DatasetIndex);
