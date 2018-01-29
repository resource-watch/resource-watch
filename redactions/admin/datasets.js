import { createAction, createThunkAction } from 'redux-tools';

import DatasetsService from 'services/DatasetsService';

/**
 * CONSTANTS
*/
const GET_DATASETS_SUCCESS = 'datasets/getDatasetsSuccess';
const GET_DATASETS_ERROR = 'datasets/getDatasetsError';
const GET_DATASETS_LOADING = 'datasets/getDatasetsLoading';
const SET_DATASETS_FILTERS = 'datasets/getDatasetsFilters';
const SET_DATASETS_ORDER_DIRECTION = 'datasets/setOrderDirection';
const SET_DATASETS_PAGINATION_PAGE = 'datasets/setDatasetsPaginationPage';
const SET_DATASETS_PAGINATION_TOTAL = 'datasets/setDatasetsPaginationTotal';
const SET_DATASETS_PAGINATION_LIMIT = 'datasets/setDatasetsPaginationLimit';

/**
 * STORE
 * @property {string} datasets.error
 * @property {{ key: string, value: string|number }[]} datasets.filters
 */
const initialState = {
  datasets: {
    list: [], // Actual list of datasets
    loading: false, // Are we loading the data?
    error: null, // An error was produced while loading the data
    filters: [], // Filters for the list of datasets
    orderDirection: 'desc', // sort's direction of the list
    pagination: {
      page: 1, // current page of the pagination
      total: 0, // total items to be paginated
      limit: 9 // size of the pagination
    }
  }
};

/**
 * REDUCER
 * @export
 * @param {initialState} state
 * @param {{ type: string, payload: any }} action
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DATASETS_LOADING: {
      const datasets = Object.assign({}, state.datasets, {
        loading: true,
        error: null
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_SUCCESS: {
      const datasets = Object.assign({}, state.datasets, {
        list: action.payload,
        loading: false,
        error: null
      });
      return Object.assign({}, state, { datasets });
    }

    case GET_DATASETS_ERROR: {
      const datasets = Object.assign({}, state.datasets, {
        loading: false,
        error: action.payload
      });
      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_FILTERS: {
      const datasets = Object.assign({}, state.datasets, { filters: action.payload });
      return Object.assign({}, state, { datasets });
    }

    case SET_DATASETS_ORDER_DIRECTION: {
      return { ...state, datasets: { ...state.datasets, orderDirection: action.payload } };
    }

    case SET_DATASETS_PAGINATION_PAGE: {
      return {
        ...state,
        datasets: {
          ...state.datasets,
          pagination: {
            ...state.datasets.pagination,
            page: action.payload
          }
        }
      };
    }

    case SET_DATASETS_PAGINATION_TOTAL: {
      return {
        ...state,
        datasets: {
          ...state.datasets,
          pagination: {
            ...state.datasets.pagination,
            total: action.payload
          }
        }
      };
    }

    case SET_DATASETS_PAGINATION_LIMIT: {
      return {
        ...state,
        datasets: {
          ...state.datasets,
          pagination: {
            ...state.datasets.pagination,
            limit: action.payload
          }
        }
      };
    }

    default:
      return state;
  }
}

/**
 * ACTIONS
 */
export const setFilters = createAction(SET_DATASETS_FILTERS);
export const setOrderDirection = createAction(SET_DATASETS_ORDER_DIRECTION);
export const setPaginationPage = createAction(SET_DATASETS_PAGINATION_PAGE);
export const setPaginationTotal = createAction(SET_DATASETS_PAGINATION_TOTAL);
export const setPaginationLimit = createAction(SET_DATASETS_PAGINATION_LIMIT);

/**
 * Retrieve the list of datasets
 * @export
 * @param {string[]} applications Name of the applications to load the datasets from
 */
export function getDatasets(options) {
  return (dispatch, getState) => {
    dispatch({ type: GET_DATASETS_LOADING });

    const state = getState();

    const service = new DatasetsService({
      language: state.common.locale
    });

    service.fetchAdminData(options)
      .then((data) => {
        dispatch({ type: GET_DATASETS_SUCCESS, payload: data });
      })
      .catch((err) => {
        dispatch({ type: GET_DATASETS_ERROR, payload: err.message });
      });
  };
}

export const getAllDatasets = createThunkAction('datasets/getAllDatasets', options =>
  (dispatch, getState) => {
    dispatch({ type: GET_DATASETS_LOADING });
    const { user } = getState();

    return DatasetsService.getAllDatasets(user.token, { ...options })
      .then(({ data, meta }) => {
        const { 'total-items': totalItems } = meta;
        dispatch({
          type: GET_DATASETS_SUCCESS,
          payload: data.map(d => ({ ...{ id: d.id, type: d.type }, ...d.attributes }))
        });
        dispatch(setPaginationTotal(totalItems));
      })
      .catch((err) => {
        dispatch({ type: GET_DATASETS_ERROR, payload: err.message });
      });
  });

export const getDatasetsByTab = createThunkAction('datasets/getDatasetsByTab', tab =>
  (dispatch, getState) => {
    const { user, datasets } = getState();
    const { id } = user;
    const { orderDirection, pagination, filters } = datasets.datasets;
    const { page, limit } = pagination;
    let options = {
      filters: {
        'page[size]': limit,
        'page[number]': page,
        sort: (orderDirection === 'asc') ? 'updatedAt' : '-updatedAt',
        name: (filters.find(filter => filter.key === 'name') || {}).value
      },
      includes: ['widget', 'layer', 'metadata', 'vocabulary'].join(',')
    };

    switch (tab) {
      // when the user asks for a its own datasets...
      case 'my_datasets':
        options = { ...options,
          filters: {
            ...options.filters,
            userId: id
          }
        };

        break;

      // when the user asks for its favourites datasets...
      case 'favourites':
        options = { ...options,
          filters: {
            ...options.filters,
            favourites: true
          }
        };
        break;

      // when the user asks for a specific collection...
      default:
        options = {
          ...options,
          filters: {
            ...options.filters,
            collection: tab
          }
        };
    }

    dispatch(getAllDatasets({ ...options }));
  });

