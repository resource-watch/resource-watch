import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { getDatasetsByTab, setPaginationPage, setPaginationTotal, resetDatasets } from 'redactions/admin/datasets';

// components
import DatasetList from './dataset-list-component';

class DatasetListContainer extends PureComponent {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    tab: PropTypes.string.isRequired,
    subtab: PropTypes.string.isRequired,
    orderDirection: PropTypes.string.isRequired,
    pagination: PropTypes.object.isRequired,
    getDatasetsByTab: PropTypes.func.isRequired,
    setPaginationPage: PropTypes.func.isRequired,
    setPaginationTotal: PropTypes.func.isRequired,
    resetDatasets: PropTypes.func.isRequired
  }

  UNSAFE_componentWillMount() {
    this.props.getDatasetsByTab(this.props.subtab);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { pathname, subtab, orderDirection, pagination } = this.props;
    const { page } = pagination;
    const isMyRW = pathname.startsWith('/myrw');
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
