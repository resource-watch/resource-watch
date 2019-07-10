import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';

// services
import { fetchWidgets } from 'services/widget';

import {
  setWidgets,
  setTab,
  setPage,
  setSearch,
  setLoading,
  setError,
  setTotal,
  setPages
} from './actions';
import reducer from './reducer';
import initialState from './initial-state';
import WidgetBlockEditionComponent from './component';

const WidgetBlockEdition = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { search, tab, page } = state;
  const { page: initialPage } = initialState;
  const { user, onSubmit } = props;
  const [debouncedSearch] = useDebouncedCallback(
    (searchTerm) => {
      dispatch(setPage(initialPage));
      dispatch(setSearch(searchTerm));
    }, 250
  );

  useEffect(() => {
    fetchWidgets(
      {
        ...(tab === 'my-widgets' && { userId: user.id }),
        ...(tab === 'my-favourites' && { favourite: true }),
        ...(!!search && { name: search }),
        'page[number]': page
      },
      { Authorization: user.token },
      true
    )
      .then(({ widgets, meta }) => {
        dispatch(setLoading(false));
        dispatch(setError(null));
        dispatch(setWidgets(widgets));
        dispatch(setTotal(meta['total-items']));
        dispatch(setPages(meta['total-pages']));
      })
      .catch((err) => {
        dispatch(setLoading(false));
        dispatch(setError(err.message));
      });
  }, [search, tab, page]);

  return (
    <WidgetBlockEditionComponent
      {...state}
      onSelectWidget={(widget) => {
        onSubmit({
          widgetId: widget.id,
          datasetId: widget.dataset,
          categories: []
        });
      }}
      onChangeTab={(newTab) => {
        dispatch(setTab(newTab));
        dispatch(setPage(initialPage));
      }}
      onChangePage={(newPage) => {
        dispatch(setPage(newPage));
      }}
      onChangeSearch={(searchTerm) => { debouncedSearch(searchTerm); }}
      {...props}
    />
  );
};

WidgetBlockEdition.propTypes = {
  user: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({ user: state.user }),
  null
)(WidgetBlockEdition);
