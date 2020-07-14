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

/**
 * Fetch Country Power Explorer config
 */
export const fetchCountryPowerExplorerConfig = () =>
  new Promise((resolve, reject) => {
    logger.info('Fetch Country Power Explorer config');

    axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/CountryEnergyExplorer.json')
      .then(response => resolve(response.data))
      .catch(error => reject(new Error(`There was an error loading the Country Power Explorer config: ${error}`)));
  });

export default {
  fetchExploreConfig,
  fetchCountryPowerExplorerConfig
};
