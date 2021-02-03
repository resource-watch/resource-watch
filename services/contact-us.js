// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

/**
 * Sends a contact form including a topic, email address, and a message.
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#contact-us|here}
 * @param {Object} params Request paremeters to API.
 * @returns {Promise}
 */
export const contactUs = (params) => {
  logger.info('Contact us');
  return WRIAPI.post('contact-us', params)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error with contact us endpoint: ${status}: ${statusText}`);
      throw new Error(`Error with contact us endpoint: ${status}: ${statusText}`);
    });
};

export default { contactUs };
