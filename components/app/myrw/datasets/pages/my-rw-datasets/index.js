import { connect } from 'react-redux';

// actions
import { setFilters, setPaginationPage, setOrderDirection, getDatasetsByTab } from 'redactions/admin/datasets';

import MyRWDatasetsMy from './my-rw-datasets-component';

const mapStateToProps = state => ({
  user: state.user,
  subtab: state.routes.query.subtab,
  orderDirection: state.datasets.datasets.orderDirection,
  pagination: state.datasets.datasets.pagination,
  routes: state.routes
});

const mapDispatchToProps = {
  setFilters,
  setPaginationPage,
  setOrderDirection,
  getDatasetsByTab
};

export default connect(mapStateToProps, mapDispatchToProps)(MyRWDatasetsMy);
