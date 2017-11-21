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
    onSubmit: PropTypes.func.isRequired,
    // Redux
    fetchData: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    // Be careful here. What would happen if we create a dashboard, then I create a new widget?
    // So we will need to refresh the widgets after what??
    // We should talk about it
    if (!props.data.widgets.length) {
      props.fetchData();
    }
  }

  render() {
    return createElement(WidgetBlockEditionComponent, {
      onSelect: (widget) => {
        this.props.onSubmit({
          widgetId: widget.id,
          categories: []
        });
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
