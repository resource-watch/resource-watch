export const convertToJSON = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`${process.env.WRI_API_URL}/v1/ogr/convert`, {
    method: 'POST',
    body: formData,
    multipart: true,
  })
    .then((response) => {
      if (!response.ok) throw new Error('The file couldn\'t be processed correctly. Make sure the format is supported. If it is, try again in a few minutes.');
      return response.json();
    })
    .then(({ data }) => {
      const { features } = data.attributes;

      if (!features || !features.length || !Array.isArray(features)) {
        throw new Error('The geometry seems to be empty. Please make sure the file isn\'t empty.');
      }

      return data.attributes;
    });
};

export const readJSONFile = (file) => new Promise((resolve) => {
  // We read the file and resolve the json object
  const reader = new FileReader();
  reader.onload = () => resolve(JSON.parse(reader.result));
  reader.onerror = () => {
    throw new Error('Unable to read the geojson file. Please try to upload it again.');
  };
  reader.readAsText(file);
});

export const getFileType = (file) => file.name.split('.').pop();

export const processFile = async (file) => new Promise((resolve, reject) => {
  // First step: we convert the file to a geojson format
  // If the file is already a geojson, we don't need to convert it
  const fileType = getFileType(file);
  if (fileType === 'geojson') {
    // If there's an error, it will be caught at a higher level
    readJSONFile(file)
      .then(resolve)
      .catch(reject);
  } else { // Otherwise, we convert it
    // If there's an error, it will be caught at a higher level
    convertToJSON(file)
      .then(resolve)
      .catch(reject);
  }
})
  // Second: we store it in the geostore
  .then((geojson) => fetch(`${process.env.WRI_API_URL}/v1/geostore`, {
    method: 'POST',
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify({ geojson }),
  }))
  .then((response) => {
    if (!response.ok) throw new Error('The file couldn\'t be processed correctly. Try again in a few minutes.');
    return response.json();
  })
  // Finally: we return the id of the geojson
  .then(({ data }) => data.id);
