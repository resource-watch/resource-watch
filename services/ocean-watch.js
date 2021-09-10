import axios from 'axios';

// data
import OceanWatchConfigFile from 'public/static/data/ocean-watch';

export const fetchConfigFile = () => {
  // in development, we work with the local file
  if (process.env.NODE_ENV === 'development') return Promise.resolve(OceanWatchConfigFile[process.env.NEXT_PUBLIC_API_ENV === 'staging' ? 'staging' : 'production']);

  return axios.get('https://raw.githubusercontent.com/resource-watch/resource-watch/develop/public/static/data/ocean-watch.json')
    .then(({ data }) => data[process.env.NEXT_PUBLIC_API_ENV === 'staging' ? 'staging' : 'production']);
};

export const fetchOceanWatchAreas = () => axios.get('https://wri-rw.carto.com:443/api/v2/sql', {
  params: {
    q: 'select name_0 as name, gid_0 as iso, geostore_prod as geostore from "wri-rw".gadm36_0 where geostore_prod is not NULL and coastal is true order by name asc',
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
