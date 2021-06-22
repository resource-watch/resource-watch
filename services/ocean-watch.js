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

export const fetchOceanWatchAreas = () => {
  // As of date, we have 2 different databases for data,
  // so ids need to be different depending on the environment deployed.
  const isStagingAPI = process.env.NEXT_PUBLIC_WRI_API_URL.includes('staging-api.resourcewatch.org');

  const geostoreEnvironment = isStagingAPI ? 'geostore_staging' : 'geostore_prod';

  return axios.get('https://wri-rw.carto.com:443/api/v2/sql', {
    params: {
      q: `select name_0 as name, gid_0 as iso, ${geostoreEnvironment} as geostore from "wri-rw".gadm36_0 where ${geostoreEnvironment} is not NULL`,
    },
  })
    .then(({ data }) => data.rows.map(({
      iso,
      name,
      geostore,
    }) => ({
      iso,
      name,
      geostore,
    })));
};
