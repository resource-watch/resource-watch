function getFieldUrl(id, provider, tableName) {
  let url;

  switch (provider) {
    case 'cartodb':
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select (ST_METADATA(st_union(the_raster_webmercator))).* from ${tableName}`;
      break;
    case 'gee':
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select ST_METADATA(rast) from "${tableName}"`;
      break;
    default:
      url = `${process.env.WRI_API_URL}/fields/${id}`;
  }

  return url;
}

function getFields(data = {}, provider) {
  let fields = [];

  switch (provider) {
    case 'cartodb':
      fields = Object.keys(data.data || {}).map(field => ({
        name: (data.data[field] || {}).numbands,
        type: null
      }));
      break;
    case 'gee':
      fields = ((data.data[0] || {}).bands || []).map(band => ({
        name: band.id,
        type: null
      }));
      break;
    default:
      fields = Object.keys(data.fields || {}).map(field => ({
        name: field,
        type: (data.fields[field] || {}).type
      }));
  }

  return fields;
}

export { getFieldUrl, getFields };
