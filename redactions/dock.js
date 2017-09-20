// CONSTANTS
const DOCK_TOGGLE = 'DOCK_TOGGLE';
const DOCK_SET_OPTIONS = 'DOCK_SET_OPTIONS';

// REDUCER
const initialState = {
  opened: false,
  options: {
    children: null,
    childrenProps: null
  }
};

export default function dockReducer(state = initialState, action) {
  switch (action.type) {
    case DOCK_TOGGLE:
      return Object.assign({}, state, { opened: action.payload });

    case DOCK_SET_OPTIONS:
      return Object.assign({}, state, { options: action.payload });

    default:
      return state;
  }
}


// ACTIONS
export function toggleDock(opened, opts = {}) {
  return (dispatch) => {
    if (opened && opts) {
      dispatch({ type: DOCK_SET_OPTIONS, payload: opts });
    }

    dispatch({ type: DOCK_TOGGLE, payload: opened });
  };
}

export function setDockOptions(opts = {}) {
  return dispatch => dispatch({ type: DOCK_SET_OPTIONS, payload: opts });
}
