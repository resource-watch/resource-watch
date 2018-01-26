import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { getDatasets, setFilters } from 'redactions/admin/datasets';

// selectors
import getFilteredDatasets from 'selectors/myrw/datasets';

// components
import DatasetList from './DatasetsList';

class DatasetListContainer extends PureComponent {
  static propTypes = {
    setFilters: PropTypes.func,
    getDatasets: PropTypes.func
  }

  componentWillMount() {
    this.props.setFilters([]);
    this.props.getDatasets({
      includes: ['widget', 'layer', 'metadata', 'vocabulary'].join(',')
    });
  }

  render() {
    return (<DatasetList {...this.props} />);
  }
}

const mapStateToProps = state => ({
  datasets: getFilteredDatasets(state),
  filters: state.datasets.datasets.filters,
  loading: state.datasets.datasets.loading,
  currentTab: state.routes.query.subtab,
  user: state.user
});

const mapDispatchToProps = {
  getDatasets,
  setFilters
};


export default connect(mapStateToProps, mapDispatchToProps)(DatasetListContainer);
