import { scalePow } from 'd3-scale';

import {
  dateDiffInDays,
  getYear
} from 'utils/dates';

const getExp = z => (z < 11 ? 0.3 + (z - 3) / 20 : 1);

const getScale = z =>
  scalePow()
    .exponent(getExp(z))
    .domain([0, 256])
    .range([0, 256]);

const getDayRange = (params) => {
  const { startDate, endDate, minDate, maxDate, weeks } = params || {};

  const minDateTime = new Date(minDate);
  const maxDateTime = new Date(maxDate);
  const numberOfDays = dateDiffInDays(maxDateTime, minDateTime);

  // timeline or hover effect active range
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);
  const activeStartDay =
    numberOfDays - dateDiffInDays(maxDateTime, startDateTime);
  const activeEndDay = numberOfDays - dateDiffInDays(maxDateTime, endDateTime);

  // show specified weeks from end date
  const rangeStartDate = weeks && numberOfDays - 7 * weeks;
  // get start and end day
  const startDay = activeStartDay || rangeStartDate || 0;
  const endDay = activeEndDay || numberOfDays;

  return {
    startDay,
    endDay,
    numberOfDays
  };
};

const decodes = {
  treeCoverLoss: (data, w, h, z, params) => {
    'use asm';

    const components = 4;
    const imgData = data;
    const myScale = getScale(z);

    const { startDate, endDate } = params;
    const yearStart = getYear(startDate);
    const yearEnd = getYear(endDate);

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = (j * w + i) * components;
        const yearLoss = 2000 + imgData[pixelPos + 2];
        if (yearLoss >= yearStart && yearLoss <= yearEnd) {
          const intensity = imgData[pixelPos];
          const scaleIntensity = myScale(intensity);
          imgData[pixelPos] = 220;
          imgData[pixelPos + 1] = 72 - z + 102 - 3 * scaleIntensity / z;
          imgData[pixelPos + 2] = 33 - z + 153 - intensity / z;
          imgData[pixelPos + 3] = z < 13 ? scaleIntensity : intensity;
        } else {
          imgData[pixelPos + 3] = 0;
        }
      }
    }
  },
  GLADs: (data, w, h, z, params) => {
    'use asm';

    // fixed variables
    const imgData = data;
    const { confirmedOnly } = params;

    const { startDay, endDay, numberOfDays } = getDayRange(params) || {};

    const confidenceValue = confirmedOnly ? 200 : 0;
    const pixelComponents = 4; // RGBA
    let pixelPos = 0;

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        pixelPos = (j * w + i) * pixelComponents;
        // day 0 is 2015-01-01 until latest date from fetch
        const day = imgData[pixelPos] * 255 + imgData[pixelPos + 1];
        const confidence = data[pixelPos + 2];

        if (
          day > 0 &&
          day >= startDay &&
          day <= endDay &&
          confidence >= confidenceValue
        ) {
          // get intensity
          let intensity = (confidence % 100) * 50;
          if (intensity > 255) {
            intensity = 255;
          }
          if (day >= numberOfDays - 7 && day <= numberOfDays) {
            imgData[pixelPos] = 219;
            imgData[pixelPos + 1] = 168;
            imgData[pixelPos + 2] = 0;
            imgData[pixelPos + 3] = intensity;
          } else {
            imgData[pixelPos] = 220;
            imgData[pixelPos + 1] = 102;
            imgData[pixelPos + 2] = 153;
            imgData[pixelPos + 3] = intensity;
          }
          continue; // eslint-disable-line
        }

        imgData[pixelPos + 3] = 0;
      }
    }
  },
  biomassLoss: (data, w, h, z, params) => {
    'use asm';

    const imgData = data;
    const components = 4;
    const myScale = getScale(z);

    const { startDate, endDate } = params;
    const yearStart = getYear(startDate);
    const yearEnd = getYear(endDate);

    const buckets = [
      255,
      31,
      38, // first bucket R G B
      210,
      31,
      38,
      210,
      31,
      38,
      241,
      152,
      19,
      255,
      208,
      11
    ]; // last bucket
    const countBuckets = buckets.length / 3; // 3: three bands

    for (let i = 0; i < w; ++i) {
      for (let j = 0; j < h; ++j) {
        const pixelPos = (j * w + i) * components;
        imgData[pixelPos + 3] = 0;

        if (imgData[pixelPos] !== 0) {
          // get values from data
          const intensity = myScale(imgData[pixelPos + 1]);
          // filter range from dashboard
          if (intensity >= 0 && intensity <= 255) {
            const yearLoss = 2000 + imgData[pixelPos];
            if (yearLoss >= yearStart && yearLoss < yearEnd) {
              const bucket = Math.floor(countBuckets * intensity / 256) * 3;
              imgData[pixelPos] = buckets[bucket]; // R 0-255
              imgData[pixelPos + 1] = buckets[bucket + 1]; // G 0-255
              imgData[pixelPos + 2] = buckets[bucket + 2]; // B 0-255
              imgData[pixelPos + 3] = intensity; // alpha channel 0-255
            }
          }
        }
        continue; // eslint-disable-line
      }
    }
  }
};

export default {
  'tree-cover-loss': decodes.treeCoverLoss,
  'biomass-loss': decodes.biomassLoss,
  glad: decodes.GLADs
};
