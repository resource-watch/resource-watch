// CONSTANTS
const TOOLTIP_TOGGLE = 'TOOLTIP_TOGGLE';
const TOOLTIP_SET_CHILDREN = 'TOOLTIP_SET_CHILDREN';
const TOOLTIP_LOADING = 'TOOLTIP_LOADING';
const TOOLTIP_SET_CHILDREN_PROPS = 'TOOLTIP_SET_CHILDREN_PROPS';
const TOOLTIP_SET_POSITION = 'TOOLTIP_SET_POSITION';
const TOOLTIP_FOLLOW_TOGGLE = 'TOOLTIP_FOLLOW_TOGGLE';

// REDUCER
const initialState = {
  opened: false,
  children: null,
  loading: false,
  follow: false,
  childrenProps: {},
  position: {
    x: 0,
    y: 0
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case TOOLTIP_TOGGLE:
      return Object.assign({}, state, { opened: action.payload });
    case TOOLTIP_SET_CHILDREN:
      return Object.assign({}, state, { children: action.payload });
    case TOOLTIP_LOADING:
      return Object.assign({}, state, { loading: action.payload });
    case TOOLTIP_SET_CHILDREN_PROPS:
      return Object.assign({}, state, { childrenProps: action.payload });
    case TOOLTIP_SET_POSITION:
      return Object.assign({}, state, { position: { x: action.payload.x, y: action.payload.y } });
    case TOOLTIP_FOLLOW_TOGGLE:
      return Object.assign({}, state, { follow: action.payload });
    default:
      return state;
  }
}

export function setTooltipChildren(children) {
  return dispatch => dispatch({ type: TOOLTIP_SET_CHILDREN, payload: children });
}

export function toggleTooltip(opened, opts = {}) {
  return (dispatch) => {
    if (opened) {
      if (opts.children) {
        dispatch({ type: TOOLTIP_SET_CHILDREN, payload: opts.children });

        if (opts.childrenProps) {
          dispatch({ type: TOOLTIP_SET_CHILDREN_PROPS, payload: opts.childrenProps });
        }
      }

      if (opts.follow) {
        dispatch({ type: TOOLTIP_FOLLOW_TOGGLE, payload: true });

        // User has to move the mouse to receive the position
        document.addEventListener('mousemove', function onMouseMove({ clientX, clientY }) {
          dispatch({
            type: TOOLTIP_SET_POSITION,
            payload: { x: window.scrollX + clientX, y: window.scrollY + clientY }
          });
          document.removeEventListener('mousemove', onMouseMove);
        });
      } else if (opts.position) {
        dispatch({
          type: TOOLTIP_SET_POSITION,
          payload: { x: opts.position.x, y: opts.position.y }
        });
      }
    } else {
      dispatch({ type: TOOLTIP_FOLLOW_TOGGLE, payload: false });
    }

    dispatch({ type: TOOLTIP_TOGGLE, payload: opened });
  };
}

export function tooltipLoading(loading) {
  return dispatch => dispatch({ type: TOOLTIP_LOADING, payload: loading });
}

export function setTooltipPosition({ x, y }) {
  return dispatch => dispatch({ type: TOOLTIP_SET_POSITION, payload: { x, y } });
}
