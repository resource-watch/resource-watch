import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from './widget-block-actions';
import reducers from './widget-block-reducers';
import defaultState from './widget-block-default-state';

import WidgetBlockComponent from './widget-block-component';

// Mandatory
export {
  actions, reducers, defaultState
};

class WidgetBlock extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,

    // Redux
    setWidgetLoading: PropTypes.func.isRequired,
    removeWidget: PropTypes.func.isRequired
  };

  async componentWillMount() {
    if (this.props.item.content.widgetId) {
      await this.triggerFetch(this.props);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.widgetId !== this.props.item.content.widgetId) {
      await this.triggerFetch(nextProps);
    }
  }

  componentWillUnmount() {
    const { item } = this.props;
    // Reset widget
    this.props.removeWidget({
      id: `${item.content.widgetId}/${item.id}`
    });
  }

  /**
   * HELPERS
   * - triggerFetch
  */
  triggerFetch = props => props.fetchWidget({
    id: props.item.content.widgetId,
    itemId: props.item.id
  })

  render() {
    return createElement(WidgetBlockComponent, {
      onToggleLoading: (loading) => {
        this.props.setWidgetLoading(loading);
      },
      ...this.props
    });
  }
}
export default connect(
  state => ({
    data: state.widgetBlock
  }),
  actions
)(WidgetBlock);
