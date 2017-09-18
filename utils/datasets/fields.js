function getFieldUrl(id, type, provider, tableName = '') {
  let url = `${process.env.WRI_API_URL}/fields/${id}`;

  if (provider === 'gee') {
    url = `${process.env.WRI_API_URL}/query/${id}?sql=select ST_METADATA(rast) from "${tableName}"`;
  }

  // CARTO
  if (provider === 'cartodb') {
    url = `${process.env.WRI_API_URL}/query/${id}?sql=select (ST_METADATA(st_union(the_raster_webmercator))).* from ${tableName}`;
  }

  return url;
}

function getFields(data = {}, type, provider) {
  let fields = Object.keys(data.fields || {}).map(field => ({
    name: field,
    type: (data.fields[field] || {}).type
  }));

  if (provider === 'gee') {
    fields = ((data.data[0] || {}).bands || []).map(band => ({
      name: band.id,
      type: null
    }));
  }

  // CARTO
  if (provider === 'cartodb') {
    fields = Object.keys(data.data || {}).map(field => ({
      name: (data.data[field] || {}).numbands,
      type: null
    }));
  }

  return fields;
}

export { getFieldUrl, getFields };
