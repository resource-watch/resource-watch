import { formatDate } from 'utils/dates';
import { deburrUpper } from 'utils/data';
import moment from 'moment';

// constants
import { LEGEND_TIMELINE_PROPERTIES } from 'layout/explore/explore-map/constants';

export const reduceParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const { format, key, interval, count } = param;
    let paramValue = param.default;
    const isDate = deburrUpper(param.key).includes('DATE');
    if (isDate && !paramValue) {
      let date = formatDate(new Date());
      if (interval && count) date = moment(date).subtract(count, interval);
      paramValue = moment(date).format(format || 'YYYY-MM-DD');
    }

    const newObj = {
      ...obj,
      [key]: paramValue,
      ...(key === 'endDate' &&
        param.url && { latestUrl: param.url })
    };
    return newObj;
  }, {});
};

export const reduceSqlParams = (params) => {
  if (!params) return null;
  return params.reduce((obj, param) => {
    const newObj = {
      ...obj,
      ...param.key_params && {
        [param.key]: param.key_params.reduce((subObj, item) => {
          const keyValues = {
            ...subObj,
            [item.key]: item.value
          };
          return keyValues;
        }, {})
      }
    };
    return newObj;
  }, {});
};

export const getTimelineMarks = (timelineParams = {}) => {
  const initialYear = moment(timelineParams.startDate).year();
  const lastYear = moment(timelineParams.endDate).year();
  const _marks = [initialYear, lastYear].reduce((accumulator, currentValue) => ({
    ...accumulator,
    [currentValue]: {
      label: currentValue,
      style: LEGEND_TIMELINE_PROPERTIES.markStyle
    }
  }), {});

  return _marks;
};

export const getTimelineParams = (timelineParams = {}) => ({
  ...timelineParams,
  // this shouldn't be here, this is temporary
  canPlay: true,
  minDate: timelineParams.startDate,
  maxDate: timelineParams.endDate,
  trimEndDate: timelineParams.endDate,
  marks: getTimelineMarks(timelineParams)
});

export default {
  reduceParams,
  reduceSqlParams,
  getTimelineParams,
  getTimelineMarks
};
