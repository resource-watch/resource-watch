import TOPICS from 'static/data/TopicsTreeLite.json';
import GEOGRAPHIES from 'static/data/GeographiesTreeLite.json';
import DATATYPES from 'static/data/DataTypesTreeLite.json';

class DatasetFilterService {
  static getTopics() {
    return new Promise(resolve => resolve({ topics: TOPICS }));
  }
  static getGeographies() {
    return new Promise(resolve => resolve({ geographies: GEOGRAPHIES }));
  }
  static getDataTypes() {
    return new Promise(resolve => resolve({ dataTypes: DATATYPES }));
  }
}

export default DatasetFilterService;
