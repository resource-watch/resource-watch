// CONSTANTS
const SET_ROUTER = 'SET_ROUTER';
const SET_ROUTER_PAGE = 'SET_ROUTER_PAGE';

// REDUCER
const initialState = {};

export default function Routes(state = initialState, action) {
  switch (action.type) {
    case SET_ROUTER:
      return { ...state, ...action.payload };
    case SET_ROUTER_PAGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ACTIONS
export function setRouter(router) {
  return {
    type: SET_ROUTER,
    payload: {
      ...router,
      query: {
        ...router.query,
        ...router.query.page && { page: parseInt(router.query.page, 10) },
      },
    },
  };
}

export function setPage(pageNumber = 1) {
  return (dispatch, getState) => {
    const { routes } = getState();
    if (routes.query && routes.query.page) routes.query.page = parseInt(pageNumber, 10);
    dispatch({
      type: SET_ROUTER_PAGE,
      payload: routes,
    });
  };
}
