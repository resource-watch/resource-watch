import Script from 'next/script';

const GlobalCroplandChangeScript = () => {
  return (
    <Script
      id="schema-script"
      type="application/ld+json"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
        {
          "@context": "https://schema.org/",
          "@type": "Dataset",
          "name": "Global Cropland Change",
          "description": "The Global Cropland Change dataset at 30 m spatial resolution was developed by the Global Land Analysis and Discovery Lab (GLAD) at the University of Maryland (UMD) using Landsat satellite data time-series. Cropland is defined as land used to produce herbaceous crops for human consumption, forage, and biofuel. The map is based on the machine learning classification of the global Landsat data archive using locally calibrated models.",
          "url": "https://resourcewatch.org/data/explore/foo065brw1-Global-Cropland-Change",
          "alternateName": "Global cropland expansion in the 21st century",
          "creator": {
            "@type": "Organization",
            "name": "University of Maryland (UMD)",
            "url": "https://www.umd.edu/"
          },
          "citation": "P. Potapov, S. Turubanova, M.C. Hansen, A. Tyukavina, V. Zalles, A. Khan, X.-P. Song, A. Pickens, Q. Shen, J. Cortez. (2021) Accelerated expansion of global cropland extent in the 21st century. Accessed through Resource Watch, (date). www.resourcewatch.org.",
          "keywords": "Crop Health, Land Cover, Crop Yield, Crops, Food and Agriculture",
          "license": "https://creativecommons.org/licenses/by/3.0/",
          "spatialCoverage": "Global",
          "isAccessibleForFree": true,
          "temporalCoverage": "2000-2003, 2004-2007, 2008-2011, 2012-2015, and 2016-2019"
        }
    `,
      }}
    />
  );
};

export default GlobalCroplandChangeScript;
