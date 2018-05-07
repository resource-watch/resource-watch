import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { getDatasetsByTab, setPaginationPage, setPaginationTotal, resetDatasets } from 'redactions/admin/datasets';

// components
import DatasetList from './dataset-list-component';

class DatasetListContainer extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string,
    tab: PropTypes.string,
    subtab: PropTypes.string,
    orderDirection: PropTypes.string,
    pagination: PropTypes.object,
    getDatasetsByTab: PropTypes.func,
    setFilters: PropTypes.func,
    setPaginationPage: PropTypes.func,
    setPaginationTotal: PropTypes.func,
    resetDatasets: PropTypes.func
  }

  componentWillMount() {
    this.props.getDatasetsByTab(this.props.subtab);
  }

  componentWillReceiveProps(nextProps) {
    const { pathname, subtab, orderDirection, pagination } = this.props;
    const { page } = pagination;

    const isMyRW = pathname === '/app/MyRW';
    const tabChanged = subtab !== nextProps.subtab;
    const paginationPageChanged = page !== nextProps.pagination.page;
    const orderDirectionChanged = orderDirection !== nextProps.orderDirection;

    if (tabChanged || paginationPageChanged || orderDirectionChanged) {
      if (isMyRW && nextProps.tab === 'datasets' && nextProps.subtab !== 'edit') {
        this.props.getDatasetsByTab(nextProps.subtab);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetDatasets();
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
  pathname: state.routes.pathname,
  tab: state.routes.query.tab,
  subtab: state.routes.query.subtab,
  user: state.user,
  locale: state.common.locale
});

const mapDispatchToProps = {
  getDatasetsByTab,
  setPaginationPage,
  setPaginationTotal,
  resetDatasets
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetListContainer);
