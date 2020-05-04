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

    axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ExploreConfig.json')
      .then(response => resolve({
        powerGenerationResilienceAndImpacts: {
          powerMixProfile: {
            title: 'Power mix profile',
            list: ['a86d906d-9862-4783-9e30-cdb68cd808b8']
          },
          resilienceExtremeNaturalEvents: {
            title: 'Resilience to extreme natural events',
            list:[
              'b3ebc10d-9de8-4ee6-870d-1d049e8e2a99',
              'c56ee507-9a3b-41d3-90ac-1406bee32c32'
            ]
          }
        }
      }))
      .catch(error => reject(new Error('There was an error loading the Country Power Explorer config', error)));
  });

export default {
  fetchExploreConfig,
  fetchCountryPowerExplorerConfig
};
