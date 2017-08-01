/**
 * CONSTANTS
*/
const MODAL_TOGGLE = 'MODAL_TOGGLE';
const MODAL_SET_OPTIONS = 'MODAL_SET_OPTIONS';
const MODAL_LOADING = 'MODAL_LOADING';
const MODAL_EXECUTE_CLOSE_CALLBACK = 'MODAL_EXECUTE_CLOSE_CALLBACK';

// REDUCER
const initialState = {
  open: false,
  options: {
    children: null,
    childrenProps: null,
    size: '',
    // Callback executed if the user closes the modal (user interaction)
    // (not executed when toggleModal is executed)
    onCloseModal: null
  },
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case MODAL_TOGGLE:
      return Object.assign({}, state, { open: action.payload });
    case MODAL_SET_OPTIONS:
      return Object.assign({}, state, { options: action.payload });
    case MODAL_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    case MODAL_EXECUTE_CLOSE_CALLBACK:
      if (state.options.onCloseModal) {
        // We make the call asynchronous to avoid blocking the state
        // from being computed
        setTimeout(() => state.options.onCloseModal(), 0);
      }
      return state;
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

export function toggleModal(open, opts = {}, userInteraction = false) {
  return (dispatch) => {
    if (open && opts) {
      dispatch({ type: MODAL_SET_OPTIONS, payload: opts });
    }

    if (userInteraction) {
      dispatch({ type: MODAL_EXECUTE_CLOSE_CALLBACK });
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
