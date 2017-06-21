import bar from './widgets/bar';
import line from './widgets/line';

const types = { bar, line };
/**
 * It returns a string query using filters Data
 * @param  {Array} filters
 * @return {String}
 */
export default function getParsedConfig(type, parsedConfig) {
  return Object.assign({}, types[type], parsedConfig);
}
