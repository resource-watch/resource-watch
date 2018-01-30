import { Router } from 'routes';

const SET_LOCALE = 'common/SET_LOCALE';
const SET_EMBED = 'common/SET_EMBED';

const initialState = {
  locale: 'en',
  embed: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOCALE:
      return Object.assign({}, state, { locale: action.payload });

    case SET_EMBED:
      return Object.assign({}, state, { embed: action.payload });

    default:
      return state;
  }
}

/**
 * ACTIONS
 */

export function redirectTo(url) {
  return (dispatch) => {
    dispatch(Router.pushRoute(url));
  };
}

/**
 * Set the locale of the app (used by the API)
 * NOTE: doesn't not change the language of the app, only
 * Transifex can do so
 * @param {string} locale Two-letter locale
 */
export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale
  };
}

/**
 * Set if we are on an embed or not
 * @param {boolean} embed Two-letter locale
 */
export function setEmbed(embed) {
  return {
    type: SET_EMBED,
    payload: embed
  };
}
