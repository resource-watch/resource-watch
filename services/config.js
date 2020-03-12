// utils
import { WRIAPI } from 'utils/axios';
import { logger } from 'utils/logs';


/**
 * Fetch RW config
 */
export const fetchRWConfig = (token) => {
  logger.info('Fetch RW config');
  //   return WRIAPI.get(`rwConfig?env=${process.env.API_ENV}`, { headers: { Authorization: token } })
  //     .then(response => response.data)
  //     .catch(({ response }) => {
  //       const { status, statusText } = response;
  //       logger.error(`Error fetching RW config: ${status}: ${statusText}`);
  //       throw new Error(`Error fetching RW config: ${status}: ${statusText}`);
  //     });
  // TEMPORARY: DATA MOCK RETURNED
  return ({
    highlightedDatasets: [],
    relatedTopics: ['water', 'society', 'food', 'energy'],
    recentUpdated: [],
    relatedDashboards: []
  });
};

/**
 * Update RW config
 *
 */
export const updateRWConfig = (config, token) => {
  logger.info('Update RW config');
  return WRIAPI.post(`rwConfig?env=${process.env.API_ENV}`,
    config,
    { headers: { Authorization: token } })
    .then(response => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error updating RW config: ${status}: ${statusText}`);
      throw new Error(`Error updating RW config: ${status}: ${statusText}`);
    });
};

export default {
  fetchRWConfig,
  updateRWConfig
};
