// utils
import { logger } from 'utils/logs';


/**
 * Fetch RW config
 */
export const fetchExploreConfig = () =>
  new Promise((resolve, reject) => {
    logger.info('Fetch RW config');
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ExploreConfig.json');
    xhr.onload = () => resolve(JSON.parse(xhr.response));
    xhr.onerror = () => reject(new Error('There was an error loading the Explore config'));
    xhr.send();
  });

export default { fetchExploreConfig };
