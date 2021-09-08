// utils
import { logger } from 'utils/logs';
import {
  WRIAPI,
} from 'utils/axios';

/**
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/reference.html#webshot|here}
 * @param {string} widgetId ID of the widget to render a screenshot
 * @param {string} token user's token
 * @param {Object} params optional params to add to the request
   @returns {Promise} Promise object represents an URL containing the screenshot of the widget
 */
export const takeWidgetWebshot = (widgetId, token, params = {}) => {
  logger.info(`Taking webshot to widget ${widgetId}...`);

  return WRIAPI
    .post(`webshot/widget/${widgetId}/thumbnail`, {}, {
      headers: {
        Authorization: token,
      },
      params,
    })
    .then(({ data }) => data.data)
    .catch(({ response }) => {
      const { status, statusText } = response;

      if (status >= 300) {
        logger.error(`Error taking webshot to widget ${widgetId}:  ${statusText}`);
        throw new Error(`Error taking webshot to widget ${widgetId}:  ${statusText}`);
      }
    });
};

export default {
  takeWidgetWebshot,
};
