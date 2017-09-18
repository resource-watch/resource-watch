function getFieldUrl(id, type, provider, tableName = '') {
  let url = '';

  // raster
  if (type === 'raster') {
    // GEE
    if (provider === 'gee') {
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select ST_METADATA(rast) from "${tableName}"`;
    }

    // CARTO
    if (provider === 'cartodb') {
      url = `${process.env.WRI_API_URL}/query/${id}?sql=select (ST_METADATA(st_union(the_raster_webmercator))).* from ${tableName}`;
    }
  // tabular
  } else {
    url = `${process.env.WRI_API_URL}/fields/${id}`;
  }

  return url;
}

function getFields(data = {}, type, provider) {
  let fields = {};

  // raster
  if (type === 'raster') {
    // GEE
    if (provider === 'gee') {
      fields = ((data[0] || {}).bands || []).map(band => ({
        name: band.id,
        type: null
      }));
    }

    // CARTO
    if (provider === 'cartodb') {
      fields = Object.keys(data || {}).map(field => ({
        name: (data[field] || {}).numbands,
        type: null
      }));
    }
  // tabular
  } else {
    fields = Object.keys(data.fields || {}).map(field => ({
      name: field,
      type: (data.fields[field] || {}).type
    }));
  }

  return fields;
}

export { getFieldUrl, getFields };
