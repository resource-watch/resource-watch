import { HYDRATE } from 'next-redux-wrapper';

const SET_LOCALE = 'common/SET_LOCALE';
const SET_EMBED = 'common/SET_EMBED';
const SET_WEBSHOT = 'common/SET_WEBSHOT';

const initialState = {
  locale: 'en',
  embed: false,
  webshot: false,
};

export default function commonReducer(state = initialState, action) {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        ...action.payload.common,
      };
    case SET_LOCALE:
      return { ...state, locale: action.payload };

    case SET_EMBED:
      return { ...state, embed: action.payload };

    case SET_WEBSHOT:
      return { ...state, webshot: action.payload };
    default:
      return state;
  }
}

/**
 * ACTIONS
 */

/**
 * Set the locale of the app (used by the API)
 * NOTE: doesn't not change the language of the app, only
 * Transifex can do so
 * @param {string} locale Two-letter locale
 */
export function setLocale(locale) {
  return {
    type: SET_LOCALE,
    payload: locale,
  };
}

/**
 * Set if we are on an embed or not
 * @param {boolean} embed Two-letter locale
 */
export function setEmbed(embed) {
  return {
    type: SET_EMBED,
    payload: embed,
  };
}

/**
 * Set if we are on webshot mode or not
 * @param {boolean} webshot
 */
export function setWebshotMode(webshot) {
  return {
    type: SET_WEBSHOT,
    payload: webshot,
  };
}
