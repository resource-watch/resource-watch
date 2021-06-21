import axios from 'axios';

// data
import OceanWatchConfigFile from 'public/static/data/ocean-watch';

export const fetchConfigFile = () => {
  // As of date, we have 2 different databases for data,
  // so ids need to be different depending on the environment deployed.
  const isStagingAPI = process.env.NEXT_PUBLIC_WRI_API_URL.includes('staging-api.resourcewatch.org');
  // in development, we work with the local file
  if (process.env.NODE_ENV === 'development') return Promise.resolve(OceanWatchConfigFile[isStagingAPI ? 'staging' : 'production']);

  return axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ocean-watch.json')
    .then(({ data }) => data[isStagingAPI ? 'staging' : 'production']);
};

export default {
  fetchConfigFile,
};
