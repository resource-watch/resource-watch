// CONSTANTS
const TOOLTIP_TOGGLE = 'TOOLTIP_TOGGLE';
const TOOLTIP_SET_CHILDREN = 'TOOLTIP_SET_CHILDREN';
const TOOLTIP_LOADING = 'TOOLTIP_LOADING';
const TOOLTIP_SET_CHILDREN_PROPS = 'TOOLTIP_SET_CHILDREN_PROPS';
const TOOLTIP_SET_POSITION = 'TOOLTIP_SET_POSITION';
const TOOLTIP_FOLLOW_TOGGLE = 'TOOLTIP_FOLLOW_TOGGLE';
const TOOLTIP_DIRECTION = 'TOOLTIP_DIRECTION';

// REDUCER
const initialState = {
  opened: false,
  children: null,
  loading: false,
  follow: false,
  direction: 'bottom',
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
    case TOOLTIP_DIRECTION:
      return Object.assign({}, state, { direction: action.payload });
    default:
      return state;
  }
}

export function setTooltipChildren(children) {
  return dispatch => dispatch({ type: TOOLTIP_SET_CHILDREN, payload: children });
}

export function toggleTooltip(opened, opts = {}) {
  return (dispatch, getState) => {
    const { tooltip } = getState();

    // This code makes sure that if a tooltip is already opened
    // and we try to open another with a different "children", then
    // we have the time to also update the "childrenProps" before
    // rendering the component
    // What we want to avoid is that a different "children" is rendered
    // with the props that belong to a previous one
    if (opts.children && tooltip.opened && tooltip.children !== opts.children) {
      dispatch({ type: TOOLTIP_TOGGLE, payload: false });
    }

    if (opened) {
      if (opts.children) {
        dispatch({ type: TOOLTIP_SET_CHILDREN, payload: opts.children });

        if (opts.childrenProps) {
          dispatch({ type: TOOLTIP_SET_CHILDREN_PROPS, payload: opts.childrenProps });
        }
      }

      if (opts.direction) {
        dispatch({ type: TOOLTIP_DIRECTION, payload: opts.direction });
      }

      if (opts.follow) {
        dispatch({ type: TOOLTIP_FOLLOW_TOGGLE, payload: true });
        // NOTE: if this doesn't break anything, let's remove it
        // The current issue with it is that it is the third listener
        // for the tooltip on the charts:
        //  1. Listener from Vega
        //  2. Listener for the follow option (in Tooltip.js)
        //  3. This one

        // // User has to move the mouse to receive the position
        // document.addEventListener('mousemove', function onMouseMove({ clientX, clientY }) {
        //   dispatch({
        //     type: TOOLTIP_SET_POSITION,
        //     payload: { x: window.scrollX + clientX, y: window.scrollY + clientY }
        //   });
        //   document.removeEventListener('mousemove', onMouseMove);
        // });
      } else if (opts.position) {
        dispatch({
          type: TOOLTIP_SET_POSITION,
          payload: { x: opts.position.x, y: opts.position.y }
        });
      }
    } else {
      dispatch({ type: TOOLTIP_FOLLOW_TOGGLE, payload: false });

      // We reset the position of the tip each time the tooltip is
      // hidden, this way we avoid leaks
      dispatch({ type: TOOLTIP_DIRECTION, payload: initialState.direction });
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
