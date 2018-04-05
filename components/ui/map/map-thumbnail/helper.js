import 'isomorphic-fetch';

const BASEMAP_QUERY = 'SELECT the_geom_webmercator FROM gadm28_countries';
const BASEMAP_CARTOCSS = '#gadm28_countries { polygon-fill: #bbbbbb; polygon-opacity: 1; line-color: #FFFFFF; line-width: 0.5; line-opacity: 0.5; }';

export const getImageFromCarto = ({
  width, height, zoom, lat, lng, layerConfig
}) => {
  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  const { body, account } = layerConfig;
  const format = 'png';
  const layerTpl = { version: '1.3.0', stat_tag: 'API', layers: body.layers };
  const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
  const url = `https://${account}.carto.com/api/v1/map${params}`;

  return fetch(url)
    .then((response) => {
      if (response.status >= 400) throw new Error(response.json());
      return response.json();
    })
    .then((data) => {
      const { layergroupid } = data;
      return `https://${data.cdn_url.https}/${account}/api/v1/map/static/center/${layergroupid}/${zoom}/${lat}/${lng}/${width}/${height}.${format}`;
    });
};

export const getImageFromMapService = ({ width, height, layerConfig }) => {
  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  const { body } = layerConfig;
  const { url } = body;

  // BBOX for zoom 1, lat 20, long -20
  const bbox = '-125.15625000000001,-55.7765730186677,85.78125,72.81607371878991';
  const bboxSR = encodeURIComponent(JSON.stringify({ wkid: 4326 }));
  const imageSR = encodeURIComponent(JSON.stringify({ wkid: 3857 }));
  const format = 'png';

  const result = `${url}/export?bbox=${bbox}&bboxSR=${bboxSR}&layers=&layerDefs=&size=${width}%2C${height}&imageSR=${imageSR}&format=${format}&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;

  return result;
};

export const getBasemapImage = ({
  width, height, zoom, lat, lng, format, layerSpec
}) => {
  const basemapSpec = {
    account: 'wri-01',
    body: {
      maxzoom: 18,
      minzoom: 3,
      layers: [{
        type: 'mapnik',
        options: {
          sql: BASEMAP_QUERY,
          cartocss: BASEMAP_CARTOCSS,
          cartocss_version: '2.3.0'
        }
      }]
    }
  };

  const { body, account } = basemapSpec;
  const layerTpl = { version: '1.3.0', stat_tag: 'API', layers: body.layers };
  const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
  const url = `https://${account}.carto.com/api/v1/map${params}`;

  return fetch(url)
    .then((response) => {
      if (response.status >= 400) throw new Error('Bad response from server');
      return response.json();
    })
    .then((data) => {
      const { layergroupid } = data;
      if (layerSpec.provider === 'gee' ||
        layerSpec.provider === 'nexgddp' ||
        layerSpec.provider === 'leaflet') {
        return `https://${data.cdn_url.https}/${account}/api/v1/map/${layergroupid}/0/0/0.${format || 'png'}`;
      }
      return `https://${data.cdn_url.https}/${account}/api/v1/map/static/center/${layergroupid}/${zoom}/${lat}/${lng}/${width}/${height}.${format || 'png'}`;
    });
};

export const getImageForGEE = ({ layerSpec }) => {
  const { layerConfig } = layerSpec;

  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  const tile = `${process.env.WRI_API_URL}/layer/${layerSpec.id}/tile/gee/0/0/0`;

  return tile;
};

export const getImageForLeaflet = ({ layerSpec }) => {
  const { layerConfig } = layerSpec;

  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  if (layerConfig.type !== 'tileLayer') {
    return null;
  }

  const tile = layerConfig.url.replace('{z}', '0').replace('{x}', '0').replace('{y}', '0');

  return tile;
};

export const getLayerImage = async ({
  width, height, zoom, lat, lng, layerSpec
}) => {
  if (!layerSpec) throw Error('No layerSpec specified.');

  const { id, layerConfig, provider } = layerSpec;
  let result;

  switch (provider) {
    case 'carto':
      try {
        result = await getImageFromCarto({
          width, height, zoom, lat, lng, layerConfig
        });
      } catch (e) {
        result = null;
      }
      break;
    case 'cartodb':
      try {
        result = await getImageFromCarto({
          width, height, zoom, lat, lng, layerConfig
        });
      } catch (e) {
        result = null;
      }
      break;
    case 'mapservice':
      result = getImageFromMapService({ width, height, layerConfig });
      break;
    case 'featureservice':
      result = getImageFromMapService({ width, height, layerConfig });
      break;
    case 'arcgis':
      result = getImageFromMapService({ width, height, layerConfig });
      break;
    case 'gee':
      result = getImageForGEE({ layerSpec });
      break;
    case 'leaflet':
      result = getImageForLeaflet({ layerSpec });
      break;
    default:
      result = null;
  }

  return result;
};
