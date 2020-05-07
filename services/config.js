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
        map: {
          groups: [
            {
              name: 'Power mix profile',
              datasets: ['a86d906d-9862-4783-9e30-cdb68cd808b8']
            }
          ],
          header: 'Power generation resilience and impacts',
          description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.',
          mapTitle: 'Power mix profile, resilience to extreme natural events and impacts from power generation.'
        },
        sections: [
          {
            header: 'Power consumption',
            description: '',
            widgets: ['a6d0a52c-8f17-439b-a5a1-f1d1b1d6b003', '54c6e8e2-16ad-42bb-968f-ad9fab589fac']
          },
          {
            header: 'Historic greenhouse gas emissions, projections and commitments',
            description: '',
            widgets: []
          }
        ]
      }))
      .catch(error => reject(new Error('There was an error loading the Country Power Explorer config', error)));
  });

export default {
  fetchExploreConfig,
  fetchCountryPowerExplorerConfig
};
