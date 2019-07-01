import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { connect } from 'react-redux';
import {
  setWidgets,
  setTab,
  setPage,
  setSearch,
  fetchWidgets
} from './actions';
import reducer from './reducer';
import initialState from './initial-state';

import WidgetBlockEditionComponent from './component';

const WidgetBlockEdition = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    search,
    tab,
    pagination: { page },
    user
  } = state;

  useEffect(() => {
    dispatch(fetchWidgets({
      filters: {
        ...tab === 'my-widgets' && { userId: user.id },
        ...tab === 'my-favourites' && { favourite: true },
        ...!!search && { name: search },
        'page[number]': page
      }
    }));
  }, [search, tab, page, user]);

  useEffect(() => () => {
    dispatch(setWidgets([]));
    dispatch(setPage(1));
    dispatch(setSearch(''));
  }, []);

  return (
    <WidgetBlockEditionComponent
      onSelectWidget={(widget) => {
        this.props.onSubmit({
          widgetId: widget.id,
          datasetId: widget.dataset,
          categories: []
        });
      }}
      onChangeTab={(newTab) => {
        dispatch(setTab(newTab));
        dispatch(setPage(1));
      }}
      onChangePage={(newPage) => {
        dispatch(setPage(newPage));
      }}
      onChangeSearch={debounce((newSearch) => {
        dispatch(setSearch(newSearch));
      }, 250)}
      {...props}
    />
  );
};

WidgetBlockEdition.propTypes = {
  data: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({
    data: state.widgetBlockEdition,
    user: state.user
  }),
  null
)(WidgetBlockEdition);
