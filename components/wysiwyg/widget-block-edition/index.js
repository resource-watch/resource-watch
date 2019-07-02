import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

// services
import { fetchWidgets } from 'services/widget';

// store
import { connect } from 'react-redux';
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
  const { user } = props;

  useEffect(() => {
    fetchWidgets(
      {
        filters: {
          ...(tab === 'my-widgets' && { userId: user.id }),
          ...(tab === 'my-favourites' && { favourite: true }),
          ...(!!search && { name: search }),
          'page[number]': page
        }
      },
      { Authorization: user.id },
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
        dispatch(setError(err));
      });
  }, [search, tab, page, user]);

  useEffect(
    () => () => {
      dispatch(setWidgets([]));
      dispatch(setPage(1));
      dispatch(setSearch(''));
    },
    []
  );

  return (
    <WidgetBlockEditionComponent
      {...state}
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
  state => ({ user: state.user }),
  null
)(WidgetBlockEdition);
