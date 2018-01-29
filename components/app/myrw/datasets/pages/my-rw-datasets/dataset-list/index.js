import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { getDatasetsByTab, setPaginationPage, setPaginationTotal } from 'redactions/admin/datasets';

// components
import DatasetList from './dataset-list-component';

class DatasetListContainer extends PureComponent {
  static propTypes = {
    currentTab: PropTypes.string,
    orderDirection: PropTypes.string,
    pagination: PropTypes.object,
    getDatasetsByTab: PropTypes.func,
    setFilters: PropTypes.func,
    setPaginationPage: PropTypes.func,
    setPaginationTotal: PropTypes.func
  }

  componentWillMount() {
    this.props.getDatasetsByTab(this.props.currentTab);
  }

  componentWillReceiveProps(nextProps) {
    const { currentTab, orderDirection, pagination } = this.props;
    const { page } = pagination;

    const tabChanged = currentTab !== nextProps.currentTab;
    const paginationPageChanged = page !== nextProps.pagination.page;
    const orderDirectionChanged = orderDirection !== nextProps.orderDirection;

    if (tabChanged || paginationPageChanged || orderDirectionChanged) {
      this.props.getDatasetsByTab(nextProps.currentTab);
    }
  }

  render() {
    return (<DatasetList {...this.props} />);
  }
}

const mapStateToProps = state => ({
  datasets: state.datasets.datasets.list,
  filters: state.datasets.datasets.filters,
  loading: state.datasets.datasets.loading,
  orderDirection: state.datasets.datasets.orderDirection,
  pagination: state.datasets.datasets.pagination,
  currentTab: state.routes.query.subtab,
  user: state.user,
  locale: state.common.locale
});

const mapDispatchToProps = {
  getDatasetsByTab,
  setPaginationPage,
  setPaginationTotal
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetListContainer);
