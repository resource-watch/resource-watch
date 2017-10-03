import 'isomorphic-fetch';
import L from 'leaflet';

const BASEMAP_QUERY = 'SELECT the_geom_webmercator FROM gadm28_countries';
const BASEMAP_CARTOCSS = '#gadm28_countries { polygon-fill: #bbbbbb; polygon-opacity: 1; line-color: #FFFFFF; line-width: 0.5; line-opacity: 0.5; }';


function calculateBounds(center, zoom, size) {
  const { w, h } = size;
  const el = document.createElement('div');
  el.width = w;
  el.height = h;

  const map = L.map(el, { center: [20, -20], zoom });
  const bbox = map.getBounds().toBBoxString();
  console.log(bbox);

  setTimeout(() => {
    console.log(map.getBounds().toBBoxString());
  }, 100);

  return bbox;

  // const latlng = map.layerPointToLatLng([w/2, h/2]);
  // console.log(latlng);
  // const point = map.wrapLatLngBounds([w, h]);
  // console.log(point);
  // const scale = 4.021000984471262E8;
  // const resolution = 1 / ((1 / zoom) * scale * 72);
  // const halfWDeg = (size.w * resolution) / 2;
  // const halfHDeg = (size.h * resolution) / 2;

  // console.log(resolution);

  // return {
  //   left: center.lon - halfWDeg,
  //   bottom: center.lat - halfHDeg,
  //   right: center.lon + halfWDeg,
  //   top: center.lat + halfHDeg
  // };
}

export const getImageFromCarto = ({ width, height, zoom, lat, lng, layerConfig }) => {
  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  const { body, account } = layerConfig;
  const format = 'png';
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
      return `https://${data.cdn_url.https}/${account}/api/v1/map/static/center/${layergroupid}/${zoom}/${lat}/${lng}/${width}/${height}.${format}`;
    });
};

export const getImageFromMapService = ({ width, height, zoom, layerConfig }) => {
  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  // calculateBounds({ lat: 20, lng: -20 }, zoom, { w: width, h: height });

  const { body } = layerConfig;
  const { url } = body;
  const lat = 90;
  const lng = 180;
  // const bbox = encodeURIComponent([-lng, -lat, lng, lat].join(''));
  const bbox = encodeURIComponent('-19.687500000000004,19.973348786110613,-19.687500000000004,19.973348786110613');
  const bboxSR = encodeURIComponent(JSON.stringify({ wkid: 4326 })); // 4326 3857
  const imageSR = encodeURIComponent(JSON.stringify({ wkid: 4326 }));
  const format = 'png';

  return `${url}/export?bbox=${bbox}&bboxSR=${bboxSR}&layers=&layerDefs=&size=${width}%2C${height}&imageSR=${imageSR}&format=${format}&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&f=image`;
};

export const getBasemapImage = async ({ width, height, zoom, lat, lng }) => {
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
  const format = 'png';
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
      return `https://${data.cdn_url.https}/${account}/api/v1/map/static/center/${layergroupid}/${zoom}/${lat}/${lng}/${width}/${height}.${format}`;
    });
};

export const getLayerImage = async ({ width, height, zoom, lat, lng, layerSpec }) => {
  let result;
  const { provider, layerConfig } = layerSpec;

  switch (provider) {
    case 'carto':
      result = await getImageFromCarto({ width, height, zoom, lat, lng, layerConfig });
      break;
    case 'cartodb':
      result = await getImageFromCarto({ width, height, zoom, lat, lng, layerConfig });
      break;
    case 'mapservice':
      result = getImageFromMapService({ width, height, zoom, lat, lng, layerConfig });
      break;
    default:
      result = null;
  }

  return result;
};
