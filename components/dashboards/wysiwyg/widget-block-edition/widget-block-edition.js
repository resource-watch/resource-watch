import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WidgetBlockEditionComponent from './widget-block-edition-component';

import * as actions from './widget-block-edition-actions';
import reducers from './widget-block-edition-reducers';
import defaultState from './widget-block-edition-default-state';

// Manadatory
export {
  actions, reducers, defaultState
};

class WidgetBlockEdition extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // Redux
    fetchWidgets: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.triggerFetch(props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.data.tab !== this.props.data.tab) ||
      (nextProps.data.page !== this.props.data.page)
    ) {
      this.triggerFetch(nextProps);
    }
  }

  /**
   * HELPERS
   * - triggerFetch
  */
  triggerFetch = (props) => {
    props.fetchWidgets({
      filters: {
        ...props.data.tab === 'my-widgets' && { userId: props.user.id },
        'page[number]': props.data.page
      }
    });
  }

  render() {
    return createElement(WidgetBlockEditionComponent, {
      onSelectWidget: (widget) => {
        this.props.onSubmit({
          widgetId: widget.id,
          categories: []
        });
      },
      onChangeTab: (tab) => {
        this.props.setTab(tab);
        this.props.setPage(1);
      },
      onChangePage: (page) => {
        this.props.setPage(page);
      },
      ...this.props
    });
  }
}
export default connect(
  state => ({
    data: state.widgetBlockEdition,
    user: state.user
  }),
  actions
)(WidgetBlockEdition);
