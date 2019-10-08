// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';

export const contactUs = (params) => {
  logger.info('Contact us');
  return WRIAPI.get('contact-us', { params })
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error with contact us endpoint: ${status}: ${statusText}`);
      throw new Error(`Error with contact us endpoint: ${status}: ${statusText}`);
    });
};

export default { contactUs };

