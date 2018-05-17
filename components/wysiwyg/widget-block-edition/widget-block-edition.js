import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';
import * as actions from './widget-block-edition-actions';
import * as reducers from './widget-block-edition-reducers';
import initialState from './widget-block-edition-default-state';

import WidgetBlockEditionComponent from './widget-block-edition-component';

// Mandatory
export {
  actions, reducers, initialState
};

class WidgetBlockEdition extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // Redux
    setWidgets: PropTypes.func.isRequired,
    setTab: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    setSearch: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.triggerFetch(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.data.tab !== this.props.data.tab) ||
      (nextProps.data.page !== this.props.data.page) ||
      (nextProps.data.search !== this.props.data.search)
    ) {
      this.triggerFetch(nextProps);
    }
  }

  componentWillUnmount() {
    // Reset page and search params
    this.props.setWidgets([]);
    this.props.setPage(1);
    this.props.setSearch('');
  }

  /**
   * HELPERS
   * - triggerFetch
  */
  triggerFetch = (props) => {
    props.fetchWidgets({
      filters: {
        ...props.data.tab === 'my-widgets' && { userId: props.user.id },
        ...props.data.tab === 'my-favourites' && { favourite: true },
        ...!!props.data.search && { name: props.data.search },
        'page[number]': props.data.page
      }
    });
  }

  render() {
    return (
      <WidgetBlockEditionComponent
        onSelectWidget={(widget) => {
          this.props.onSubmit({
            widgetId: widget.id,
            datasetId: widget.dataset,
            categories: []
          });
        }}
        onChangeTab={(tab) => {
          this.props.setTab(tab);
          this.props.setPage(1);
        }}
        onChangePage={(page) => {
          this.props.setPage(page);
        }}
        onChangeSearch={debounce((search) => {
          this.props.setSearch(search);
        }, 250)}
        {...this.props}
      />
    );
  }
}
export default connect(
  state => ({
    data: state.widgetBlockEdition,
    user: state.user
  }),
  actions
)(WidgetBlockEdition);
