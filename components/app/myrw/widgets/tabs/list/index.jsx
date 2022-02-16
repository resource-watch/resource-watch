import { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { toastr } from 'react-redux-toastr';
import debounce from 'lodash/debounce';

// services
import { fetchWidgets } from 'services/widget';

// hooks
import { useFetchUserData } from 'hooks/user';

// utils
import { getParametrizedWidget } from 'utils/widget';

// store
import reducer from './reducer';
import { setDisplay, setPagination, setSearch, setSort, setWidgetState } from './actions';
import initialState from './initial-state';

// components
import WidgetList from './component';

// helpers
import { getQueryParams } from './helpers';
import { useCallback } from 'react';

const WidgetListTabContainer = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    user: { token },
  } = props;
  const {
    search,
    sort,
    pagination: { page },
  } = state;
  const {
    query: { params },
  } = useRouter();
  const subtab = params?.[1] || null;

  const { data: userWidgetParametrization, isFetched } = useFetchUserData({
    select: (userData) =>
      userData?.applicationData?.[process.env.NEXT_PUBLIC_APPLICATIONS]?.widgets || {},
  });

  const getWidgets = useCallback(() => {
    const queryParams = getQueryParams(state, props);

    dispatch(
      setWidgetState({
        loading: true,
        error: null,
      }),
    );
    fetchWidgets(queryParams, { Authorization: token }, true)
      .then(({ widgets, meta }) => {
        const { 'total-pages': pages, 'total-items': size } = meta;
        const nextPagination = {
          size,
          pages,
        };

        dispatch(
          setWidgetState({
            loading: false,
            list: widgets.map((_widget) =>
              getParametrizedWidget(_widget, userWidgetParametrization[_widget.id] || {}, false),
            ),
          }),
        );

        dispatch(setPagination(nextPagination));
      })
      .catch(({ message }) => {
        dispatch(
          setWidgetState({
            loading: false,
            error: message,
          }),
        );
      });
  }, [userWidgetParametrization, props, state, token]);

  useEffect(() => {
    if (subtab && isFetched) {
      getWidgets();
    }
  }, [search, sort, page, subtab, isFetched]); // eslint-disable-line

  return (
    <WidgetList
      {...state}
      sideTab={subtab}
      handlePageChange={(nextPage) => {
        dispatch(setPagination({ page: nextPage }));
      }}
      handleDisplay={(display) => {
        dispatch(setDisplay(display));
      }}
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
      handleRefresh={() => {
        getWidgets();
      }}
      thumbnail
    />
  );
};

WidgetListTabContainer.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

export default connect(
  (state) => ({
    user: state.user,
  }),
  null,
)(WidgetListTabContainer);
