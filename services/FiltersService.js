import TOPICS from 'static/data/TopicsTreeLite.json';
import GEOGRAPHIES from 'static/data/GeographiesTreeLite.json';
import DATATYPES from 'static/data/DataTypesTreeLite.json';

import { sortTree } from 'utils/explore/TreeUtil';

class DatasetFilterService {
  static getTopics() {
    return new Promise(resolve => resolve({ topics: sortTree(TOPICS) }));
  }
  static getGeographies() {
    return new Promise(resolve => resolve({ geographies: sortTree(GEOGRAPHIES) }));
  }
  static getDataTypes() {
    return new Promise(resolve => resolve({ dataTypes: sortTree(DATATYPES) }));
  }
}

export default DatasetFilterService;
