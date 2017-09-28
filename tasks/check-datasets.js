require('isomorphic-fetch');
require('colors');
require('dotenv').load();

import { getVisualisationTypes } from '../components/widget-editor/helpers/dataset-helpers';

const URL = `${process.env.WRI_API_URL}/dataset?application=rw&page[size]=999&status=saved`;

fetch(URL)
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    return response.json();
  })
  .then(function(datasets) {
    const { data } = datasets;
    for (var i = data.length - 1; i >= 0; i--) {
      const d = data[i];
      const parsedData = { id: d.id, ...d.attributes };

      try {
        const { visualisationTypes } = getVisualisationTypes(parsedData);
        if (!visualisationTypes || visualisationTypes.length === 0) {
          console.log(d.id, 'FAIL'.red, visualisationTypes);
        } else {
          console.log(d.id, 'OK'.green, visualisationTypes);
        }
      } catch(e) {
        console.log(d.id, 'FAIL'.red, e.message);
      }
    }
    console.log('Total', data.length);
  });;
