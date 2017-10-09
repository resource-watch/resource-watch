require('isomorphic-fetch');
require('colors');
require('dotenv').load();

const URL = `${process.env.WRI_API_URL}/layer?application=rw&page[size]=999&status=saved`;

const getFeatureGroupId = ({ layerConfig }) => {
  if (!layerConfig) throw Error('layerConfig param is required');
  if (!layerConfig.body) throw Error('layerConfig does not have body param');

  const { body, account } = layerConfig;
  const layerTpl = { version: '1.3.0', stat_tag: 'API', layers: body.layers };
  const params = `?stat_tag=API&config=${encodeURIComponent(JSON.stringify(layerTpl))}`;
  const url = `https://${account}.carto.com/api/v1/map${params}`;

  return fetch(url)
    .then((response) => {
      if (response.status >= 400) throw new Error(response.statusText);
      return response.json();
    });
};

fetch(URL)
  .then((response) => {
    if (response.status >= 400) throw new Error(response.statusText);
    return response.json();
  })
  .then((body) => {
    const { data } = body;

    for (let i = data.length - 1; i >= 0; i--) {
      const d = data[i];
      const parsedData = { id: d.id, ...d.attributes };
      const { layerConfig } = parsedData;

      switch (parsedData.provider) {
        case 'cartodb':
          try {
            getFeatureGroupId({ layerConfig })
              // Don't show OK
              // .then((data) => {
              //   console.log(parsedData.id, parsedData.provider, 'OK'.green);
              // })
              .catch((e) => {
                console.log(parsedData.id, parsedData.provider, 'FAIL'.red, e.message);
              });
          } catch(e) {
            console.log(parsedData.id, parsedData.provider, 'FAIL'.red, e.message);
          }
          break;
        default:
          console.log(parsedData.id, parsedData.provider, 'NO CHECKED'.blue);
      }
    }
    console.log('Total', data.length);
  });;
