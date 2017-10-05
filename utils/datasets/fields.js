function getFieldUrl(id, provider, type, tableName) {
  let url;

  switch (`${provider}-${type}`) {
    case 'cartodb-raster':
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select (ST_METADATA(st_union(the_raster_webmercator))).* from ${tableName}`;
      break;
    case 'gee-raster': {
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select ST_METADATA(rast) from "${tableName}"`;
      break;
    }
    default:
      url = `${process.env.WRI_API_URL}/fields/${id}`;
  }

  return url;
}

function getFields(data = {}, provider, type) {
  let fields = [];

  switch (`${provider}-${type}`) {
    case 'cartodb-raster':
      fields = Object.keys(data.data || {}).map(field => ({
        name: (data.data[field] || {}).numbands,
        type: null
      }));
      break;
    case 'gee-raster':
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
