import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { setOrderDirection, getWidgetsByTab, setFilters, setPaginationPage } from 'redactions/admin/widgets';

// selectors
import getFilteredWidgets from 'selectors/admin/widgets';

// components
import MyRWWidgetsMy from './my-rw-widgets-component';

class MyRWWidgetsContainer extends PureComponent {
  static propTypes = {
    subtab: PropTypes.string,
    orderDirection: PropTypes.string,
    pagination: PropTypes.object,
    getWidgets: PropTypes.func,
    getWidgetsByTab: PropTypes.func,
    setFilters: PropTypes.func
  }

  componentWillMount() {
    this.props.getWidgetsByTab(this.props.subtab);
  }

  componentWillReceiveProps(nextProps) {
    const { subtab, orderDirection, pagination } = this.props;
    const { page } = pagination;

    const tabChanged = subtab !== nextProps.subtab;
    const paginationPageChanged = page !== nextProps.pagination.page;
    const orderDirectionChanged = orderDirection !== nextProps.orderDirection;

    if (tabChanged || paginationPageChanged || orderDirectionChanged) {
      this.props.getWidgetsByTab(nextProps.subtab);
    }

    if (tabChanged) this.props.setFilters([]);
  }

  render() {
    return (<MyRWWidgetsMy
      {...this.props}
      routes={{
        index: 'myrw',
        detail: 'myrw_detail'
      }}
    />);
  }
}

const mapStateToProps = state => ({
  widgets: getFilteredWidgets(state),
  orderDirection: state.widgets.widgets.orderDirection,
  filters: state.widgets.widgets.filters,
  loading: state.widgets.widgets.loading,
  pagination: state.widgets.widgets.pagination,
  subtab: state.routes.query.subtab,
  user: state.user
});

const mapDispatchToProps = {
  setOrderDirection,
  getWidgetsByTab,
  setFilters,
  setPaginationPage
};


export default connect(mapStateToProps, mapDispatchToProps)(MyRWWidgetsContainer);
