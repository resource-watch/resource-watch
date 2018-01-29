import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// actions
import { setFilters, setPaginationPage, setOrderDirection, getDatasetsByTab } from 'redactions/admin/datasets';

import MyRWDatasetsMy from './my-rw-datasets-component';

class MyRWDatasetsMyContainer extends PureComponent {
  static propTypes = {
    subtab: PropTypes.string,
    setFilters: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    const { subtab } = this.props;

    if (subtab !== nextProps.subtab) this.props.setFilters([]);
  }

  render() {
    return (<MyRWDatasetsMy {...this.props} />);
  }
}

const mapStateToProps = state => ({
  user: state.user,
  subtab: state.routes.query.subtab,
  orderDirection: state.datasets.datasets.orderDirection,
  filters: state.datasets.datasets.filters,
  pagination: state.datasets.datasets.pagination,
  routes: state.routes
});

const mapDispatchToProps = {
  setFilters,
  setPaginationPage,
  setOrderDirection,
  getDatasetsByTab
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRWDatasetsMyContainer);
