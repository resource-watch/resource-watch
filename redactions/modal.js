/**
 * CONSTANTS
*/
const MODAL_TOGGLE = 'MODAL_TOGGLE';
const MODAL_SET_OPTIONS = 'MODAL_SET_OPTIONS';
const MODAL_LOADING = 'MODAL_LOADING';

// REDUCER
const initialState = {
  open: false,
  options: {
    children: null,
    childrenProps: null,
    size: ''
  },
  loading: false
};

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case MODAL_TOGGLE:
      return Object.assign({}, state, { open: action.payload });
    case MODAL_SET_OPTIONS:
      return Object.assign({}, state, { options: action.payload });
    case MODAL_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    default:
      return state;
  }
}

/**
 * ACTIONS
 * - closeModal
 * - toggleModal
 * - modalLoading
 * - setModalOptions
*/
export function closeModal() {
  return dispatch => dispatch({ type: MODAL_TOGGLE });
}

export function toggleModal(open, opts = {}) {
  return (dispatch) => {
    if (open && opts) {
      dispatch({ type: MODAL_SET_OPTIONS, payload: opts });
    }
    dispatch({ type: MODAL_TOGGLE, payload: open });
  };
}

export function modalLoading(loading) {
  return dispatch => dispatch({ type: MODAL_LOADING, payload: loading });
}

export function setModalOptions(opts) {
  return dispatch => dispatch({ type: MODAL_SET_OPTIONS, payload: opts });
}
