import compact from 'lodash/compact';
import truncate from 'lodash/truncate';

export function substitution(string, params) {
  // Params should have this format => [{key:'xxx', value:'xxx'},{key:'xxx', value:'xxx'}]
  // Keys to search should be in this format {{key}}
  let str = string;
  params.forEach((param) => {
    str = str.replace(new RegExp(`{{${param.key}}}`, 'g'), param.value);
  });
  return str;
}

export function concatenation(string, params) {
  // Params should have this format => [{key:'xxx', key_params:[{key:'xxx', value:'xxx'}]}]
  // Keys to search should be in this format {{key}}
  let str = string;
  let sql;
  params.forEach((param) => {
    sql = `${compact(param.keyParams.map((p) => {
      const value = p.value;
      if (value) {
        return (isNaN(value)) ? `${p.key} = '${value}'` : `${p.key} = ${value}`;
      }
      return null;
    })).join(' AND ')}`;
    sql = (sql) ? `WHERE ${sql}` : '';
    str = str.replace(new RegExp(`{{${param.key}}}`, 'g'), sql);
  });
  return str;
}

export function listSeperator(arr, key) {
  const l = arr.length - 1;
  if (l !== key) {
    return (l - 1) === key ? 'and' : ',';
  }
  return null;
}

export function paramIsTrue(param) {
  return param && /1|true/.test(param);
}

export function capitalizeFirstLetter(string) {
  if (typeof string === 'string') {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  return string;
}

export function truncateText(string, limit) {
  return truncate(string, { length: limit, separator: '', omission: '...' });
}
