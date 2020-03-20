import axios from 'axios';

// utils
import { logger } from 'utils/logs';

/**
 * Fetch Explore config
 */
export const fetchExploreConfig = () =>
  new Promise((resolve, reject) => {
    logger.info('Fetch RW config');

    axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ExploreConfig.json')
      .then(response => resolve(response.data))
      .catch(error => reject(new Error('There was an error loading the Explore config', error)));
  });

export default { fetchExploreConfig };
