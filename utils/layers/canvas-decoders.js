const decodes = {
  treeCoverLoss: `
    // values for creating power scale, domain (input), and range (output)
    float domainMin = 0.;
    float domainMax = 255.;
    float rangeMin = 0.;
    float rangeMax = 255.;
    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
    float intensity = color.r * 255.;
    // get the min, max, and current values on the power scale
    float minPow = pow(domainMin, exponent - domainMin);
    float maxPow = pow(domainMax, exponent);
    float currentPow = pow(intensity, exponent);
    // get intensity value mapped to range
    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
    // a value between 0 and 255
    alpha = zoom < 13. ? scaleIntensity / 255. : color.g;
    float year = 2000.0 + (color.b * 255.);
    // map to years
    if (year >= startYear && year <= endYear && year >= 2001.) {
      color.r = 220. / 255.;
      color.g = (72. - zoom + 102. - 3. * scaleIntensity / zoom) / 255.;
      color.b = (33. - zoom + 153. - intensity / zoom) / 255.;
    } else {
      alpha = 0.;
    }
  `,
  GLADs: `
  // values for creating power scale, domain (input), and range (output)
  float confidenceValue = 0.;
  if (confirmedOnly > 0.) {
    confidenceValue = 200.;
  }
  float day = color.r * 255. * 255. + (color.g * 255.);
  float confidence = color.b * 255.;
  if (
    day > 0. &&
    day >= startDayIndex &&
    day <= endDayIndex &&
    confidence >= confidenceValue
  ) {
    // get intensity
    float intensity = mod(confidence, 100.) * 50.;
    if (intensity > 255.) {
      intensity = 255.;
    }
    if (day >= numberOfDays - 7. && day <= numberOfDays) {
      color.r = 219. / 255.;
      color.g = 168. / 255.;
      color.b = 0.;
      alpha = intensity / 255.;
    } else {
      color.r = 220. / 255.;
      color.g = 102. / 255.;
      color.b = 153. / 255.;
      alpha = intensity / 255.;
    }
  } else {
    alpha = 0.;
  }
  `,
  biomassLoss: `
  float countBuckets = 5.; // buckets length / 3: three bands
  float year = 2000.0 + (color.r * 255.);
  if (year >= 2001. && year >= startYear && year <= endYear) {
    // values for creating power scale, domain (input), and range (output)
    float domainMin = 0.;
    float domainMax = 255.;
    float rangeMin = 0.;
    float rangeMax = 255.;
    float exponent = zoom < 13. ? 0.3 + (zoom - 3.) / 20. : 1.;
    float intensity = color.g * 255.;
    // get the min, max, and current values on the power scale
    float minPow = pow(domainMin, exponent - domainMin);
    float maxPow = pow(domainMax, exponent);
    float currentPow = pow(intensity, exponent);
    // get intensity value mapped to range
    float scaleIntensity = ((currentPow - minPow) / (maxPow - minPow) * (rangeMax - rangeMin)) + rangeMin;
    float bucket = floor(countBuckets * scaleIntensity / 256.) * 3.;
    float r = 255.;
    float g = 31.;
    float b = 38.;
    if (bucket == 3. || bucket == 6.) {
      r = 210.;
      g = 31.;
      b = 38.;
    } else if (bucket == 9.) {
      r = 241.;
      g = 152.;
      b = 19.;
    } else if (bucket == 12.) {
      r = 255.;
      g = 208.;
      b = 11.;
    }
    color.r = r / 255.;
    color.g = g / 255.;
    color.b = b / 255.;
    alpha = scaleIntensity / 255.;
  } else {
    alpha = 0.;
  }
  `
};

export default {
  'tree-cover-loss': decodes.treeCoverLoss,
  'biomass-loss': decodes.biomassLoss,
  glad: decodes.GLADs
};
