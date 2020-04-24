import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import debounce from 'lodash/debounce';

// services
import { fetchWidgets } from 'services/widget';

// store
import reducer from './reducer';
import {
  setDisplay,
  setPagination,
  setSearch,
  setSort,
  setWidgetState
} from './actions';
import initialState from './initial-state';

// components
import WidgetList from './component';

// helpers
import { getQueryParams } from './helpers';

const WidgetListTabContainer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    search,
    sort,
    pagination: { page }
  } = state;
  const {
    subtab,
    user: { token }
  } = props;

  const getWidgets = () => {
    const queryParams = getQueryParams(state, props);

    dispatch(setWidgetState({
      loading: true,
      error: null
    }));
    fetchWidgets(queryParams, { Authorization: token }, true)
      .then(({ widgets, meta }) => {
        const {
          'total-pages': pages,
          'total-items': size
        } = meta;
        const nextPagination = {
          size,
          pages
        };

        dispatch(setWidgetState({
          loading: false,
          list: widgets
        }));

        dispatch(setPagination(nextPagination));
      })
      .catch(({ message }) => {
        dispatch(setWidgetState({
          loading: false,
          error: message
        }));
      });
  };

  useEffect(() => {
    if (subtab) {
      getWidgets();
    }
  }, [search, sort, page, subtab]); // eslint-disable-line

  return (
    <WidgetList
      {...state}
      routes={{
        index: 'myrw',
        detail: 'myrw_detail'
      }}
      sideTab={subtab}
      handlePageChange={(nextPage) => { dispatch(setPagination({ page: nextPage })); }}
      handleDisplay={(display) => { dispatch(setDisplay(display)); }}
      handleSortChange={() => {
        const newSort = sort === 'asc' ? 'desc' : 'asc';
        dispatch(setSort(newSort));
      }}
      handleWidgetRemoved={() => {
        toastr.success('Success', 'Widget removed');
        getWidgets();
      }}
      handleSearch={debounce((value) => {
        if (value && value.length < 3) return;

        dispatch(setSearch(value));
        dispatch(setPagination({ page: 1 }));
      }, 300)}
      handleRefresh={() => { getWidgets(); }}
      thumbnail={true}
    />);
};

export default connect(
  state => ({
    user: state.user,
    subtab: state.routes.query.subtab
  }),
  null
)(WidgetListTabContainer);
