// CONSTANTS
const SET_SOURCES = 'sources/SET_SOURCES';
const SET_TMP_SOURCES = 'sources/SET_TMP_SOURCES';

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
