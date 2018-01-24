import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// actions
import { getWidgets, setOrderDirection, getWidgetsByTab } from 'redactions/admin/widgets';

// selectors
import getFilteredWidgets from 'selectors/admin/widgets';

// components
import MyRWWidgetsMy from './my-rw-widgets-component';

class MyRWWidgetsContainer extends PureComponent {
  static propTypes = {
    currentTab: PropTypes.string,
    getWidgets: PropTypes.func,
    getWidgetsByTab: PropTypes.func
  }

  componentWillMount() {
    this.props.getWidgetsByTab(this.props.currentTab);
  }

  componentWillReceiveProps(nextProps) {
    const { currentTab } = this.props;

    if (currentTab !== nextProps.currentTab) this.props.getWidgetsByTab(nextProps.currentTab);
  }

  render() {
    return (<MyRWWidgetsMy {...this.props} />);
  }
}

const mapStateToProps = state => ({
  widgets: getFilteredWidgets(state),
  orderDirection: state.widgets.widgets.orderDirection,
  loading: state.widgets.widgets.loading,
  currentTab: state.routes.query.subtab,
  user: state.user
});

const mapDispatchToProps = {
  getWidgets,
  setOrderDirection,
  getWidgetsByTab
};


export default connect(mapStateToProps, mapDispatchToProps)(MyRWWidgetsContainer);
