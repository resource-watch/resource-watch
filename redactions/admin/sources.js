// CONSTANTS
const SET_SOURCES = 'sources/SET_SOURCES';
const SET_TMP_SOURCES = 'sources/SET_TMP_SOURCES';
const RESET_SOURCES = 'sources/RESET_SOURCES';

// REDUCER
const initialState = {
  sources: [],
  tmpSources: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SOURCES:
      return Object.assign({}, state, { sources : action.payload });
    case SET_TMP_SOURCES:
      return Object.assign({}, state, { tmpSources : action.payload });
    case RESET_SOURCES: {
      const { sources, tmpSources } = initialState;
      return Object.assign({}, state, {
        sources,
        tmpSources
      });
    }
    default:
      return state;
  }
}

// ACTIONS
export function setSources(sources) {
  return { type: SET_SOURCES, payload: sources };
}

export function setTmpSources(sources) {
  return { type: SET_TMP_SOURCES, payload: sources };
}

export function resetSources() {
  return { type: RESET_SOURCES };
}
