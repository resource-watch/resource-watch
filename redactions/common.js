import { Router } from 'routes';

const SET_LOCALE = 'common/SET_LOCALE';
const SET_EMBED = 'common/SET_EMBED';
const SET_WEBSHOT = 'common/SET_WEBSHOT';
const SET_IS_LOADED_EXTERNALY = 'common/SET_IS_LOADED_EXTERNALY';
const SET_IS_SERVER = 'common/SET_IS_SERVER';
const SET_HOSTNAME = 'common/SET_HOSTNAME';

const initialState = {
  locale: 'en',
  embed: false,
  webshot: false,
  isLoadedExternally: false,
  isServer: true,
  hostname: 'http://www.resourcewatch.org',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LOCALE:
      return { ...state, locale: action.payload };

    case SET_EMBED:
      return { ...state, embed: action.payload };

    case SET_WEBSHOT:
      return { ...state, webshot: action.payload };

    case SET_IS_LOADED_EXTERNALY:
      return { ...state, isLoadedExternally: action.payload };

    case SET_IS_SERVER:
      return { ...state, isServer: action.payload };

    case SET_HOSTNAME:
      return { ...state, hostname: action.payload };

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

/**
 * Set if we are on an embed or not
 * @param {boolean} embed Two-letter locale
 */
export function setIsLoadedExternaly(isLoadedExternally) {
  return {
    type: SET_IS_LOADED_EXTERNALY,
    payload: isLoadedExternally,
  };
}

/**
 * Set if we are on the server side or not
 * @param {boolean} isServer boolean
 */
export function setIsServer(isServer) {
  return {
    type: SET_IS_SERVER,
    payload: isServer,
  };
}

/**
 * Set hostname
 * @param {string} hostname
 */
export function setHostname(hostname) {
  return {
    type: SET_HOSTNAME,
    payload: hostname,
  };
}
